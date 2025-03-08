import React, { useState, useEffect, useCallback, useMemo } from "react";
import { priceTiers } from "@/lib/constants";
import { getCurrentTier, getNextTierInfo, getDetailedTimeUntilChange, calculateActiveDots } from "@/lib/timerUtils";
import ExpandedSection from "./ExpandedSection";
import PaymentConfirmation from "./PaymentConfirmation";
import ProgressIndicator from "./ProgressIndicator";
import TicketHeader from "./TicketHeader";


export interface TicketTimerProps {
  /** Initial position for the timer (minutes from starting point) */
  initialMinutes?: number;
  /** Custom position for the widget (optional) */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Initial state of the expansion */
  defaultExpanded?: boolean;
  /** Callback when payment is made */
  onPayment?: (amount: string) => void;
}

/**
 * TicketTimer - A widget displaying parking rates and time remaining
 */
const TicketTimer: React.FC<TicketTimerProps> = ({ 
  initialMinutes = 0,
  position = 'bottom-right',
  defaultExpanded = false,
  onPayment
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isPaid, setIsPaid] = useState(false);
  
  // Track time in minutes (0-1440 for 24 hours)
  const [currentMinute, setCurrentMinute] = useState(initialMinutes);
  const [paidAmount, setPaidAmount] = useState("");
  
  // Used for the animation frame
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Toggle expanded state - memoized to prevent recreation on each render
  const toggleExpand = useCallback(() => {
    if (!isPaid) {
      setIsExpanded(prev => !prev);
    }
  }, [isPaid]);

  // Compute current tier and related values - memoized for performance
  const currentTier = useMemo(() => 
    getCurrentTier(currentMinute, priceTiers), 
    [currentMinute]
  );
  
  // Handle pay now button - memoized to prevent recreation on each render
  const handlePayNow = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the expanded state
    const amount = currentTier.price;
    setPaidAmount(amount);
    setIsExpanded(false);
    setIsPaid(true);
    
    // Call the onPayment callback if provided
    if (onPayment) {
      onPayment(amount);
    }
  }, [currentTier, onPayment]);
  
  
  const nextTier = useMemo(() => 
    getNextTierInfo(currentTier, priceTiers), 
    [currentTier]
  );
  
  const timeUntilChange = useMemo(() => 
    getDetailedTimeUntilChange(currentTier, currentMinute), 
    [currentTier, currentMinute]
  );
  
  const activeDots = useMemo(() => 
    calculateActiveDots(currentTier, currentMinute, animationFrame, isPaid), 
    [currentTier, currentMinute, animationFrame, isPaid]
  );
  
  // Generate position classes based on the position prop
  const positionClasses = useMemo(() => {
    switch (position) {
      case 'bottom-left': return 'fixed bottom-4 left-4';
      case 'top-right': return 'fixed top-4 right-4';
      case 'top-left': return 'fixed top-4 left-4';
      default: return 'fixed bottom-4 right-4';
    }
  }, [position]);
  
  // Animate the minutes and indicator lights - only if not paid
  useEffect(() => {
    // Skip animation if paid
    if (isPaid) return;
    
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 20);
      
      // Update minute every animation frame (accelerated for demo)
      if (animationFrame % 2 === 0) {
        setCurrentMinute(prevMinute => {
          const nextMinute = prevMinute + 1;
          return nextMinute >= 1440 ? 0 : nextMinute; // Reset after 24 hours
        });
      }
    }, 100); // Faster for demonstration
    
    return () => clearInterval(interval);
  }, [animationFrame, isPaid]);
  
  // Get formatted payment time - the time when payment was made
  const getPaymentTime = useCallback(() => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, []);
  
  // Compute height class based on expansion state and tier
  const heightClass = useMemo(() => {
    if (!isExpanded) return 'h-[120px]';
    // Use different heights for the last tier vs others
    return currentTier.tier === 4 ? 'h-[230px]' : 'h-[290px]';
  }, [isExpanded, currentTier.tier]);
  
  return (
    <div 
      className={`${positionClasses} z-50 scale-[0.9]`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-testid="ticket-timer"
    >
      <div 
        className={`
          relative 
          w-40
          cursor-pointer
          bg-gradient-to-b from-zinc-800 to-zinc-900
          rounded-2xl 
          shadow-xl
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${isHovering ? 'scale-105' : 'scale-100'}
          ${heightClass}
          ${isPaid ? 'border border-green-500/30' : ''}
        `}
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        aria-label={isExpanded ? "Collapse parking ticket details" : "Expand parking ticket details"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleExpand();
            e.preventDefault();
          }
        }}
      >
        {/* Subtle metallic texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[length:10px_10px] opacity-10"></div>
        
        {/* Gloss effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/3 opacity-30"></div>
        
        {/* Curved edge detail */}
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-zinc-950 rounded-full opacity-30"></div>
        
        {/* Main display area - always visible section */}
        <div className="absolute inset-5 flex flex-col justify-between h-[90px]">
          {/* Digital readout - displays the appropriate price based on hours with matching tier color */}
          <TicketHeader 
            isPaid={isPaid} 
            currentTier={currentTier} 
            paidAmount={paidAmount} 
          />
          
          {/* Progress indicator lights */}
          <ProgressIndicator 
            activeDots={activeDots} 
            isPaid={isPaid} 
            currentTier={currentTier} 
          />
        </div>
            
        {/* Expanded section - detailed info about next price change */}
        <div 
          className={`
            absolute top-[100px] inset-x-0 h-[130px] px-4 pt-1
            bg-gradient-to-b from-zinc-900 to-zinc-950
            border-t border-zinc-800/30
            transition-all duration-300 ease-in-out
            ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          aria-hidden={!isExpanded}
        >
          {isPaid ? (
            <PaymentConfirmation 
              getPaymentTime={getPaymentTime} 
            />
          ) : (
            <ExpandedSection 
              timeUntilChange={timeUntilChange} 
              nextTier={nextTier} 
              currentTier={currentTier} 
              handlePayNow={handlePayNow} 
            />
          )}
        </div>
          
        {/* Side texture/grip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-2">
          <div className="h-full w-full flex flex-col space-y-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="h-0.5 w-full bg-zinc-950/50"
              ></div>
            ))}
          </div>
        </div>
        
        {/* Dynamic ambient glow based on price tier or paid status */}
        <div className={`
          absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-1000
          ${isPaid 
            ? 'bg-green-500/20' 
            : currentTier.tier === 0 
              ? 'bg-green-500/20' 
              : currentTier.tier === 1 
                ? 'bg-yellow-500/20' 
                : currentTier.tier === 2 
                  ? 'bg-amber-500/20' 
                  : currentTier.tier === 3 
                    ? 'bg-orange-500/20' 
                    : 'bg-red-500/20'}
        `}></div>
        
        {/* Expand/collapse indicator - only show if not paid */}
        {!isPaid && (
          <div className={`
            absolute bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-2
            transition-all duration-300 opacity-50 
            ${isExpanded ? 'rotate-180' : 'rotate-0'}
          `}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 10" 
              fill="white"
              className="opacity-40"
              aria-hidden="true"
            >
              <path d="M0 0 L10 10 L20 0 Z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketTimer; 