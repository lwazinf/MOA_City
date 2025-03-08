import React, { useState, useEffect, useCallback, useMemo } from "react";
import { priceTiers } from "@/lib/constants";
import { getCurrentTier, getNextTierInfo, getDetailedTimeUntilChange, calculateActiveDots } from "@/lib/timerUtils";
import ExpandedSection from "./ExpandedSection";
import PaymentConfirmation from "./PaymentConfirmation";
import ProgressIndicator from "./ProgressIndicator";
import TicketHeader from "./TicketHeader";

// Import Roboto font
import { Roboto } from 'next/font/google';

// Initialize Roboto font
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
  
  // State for click animation
  const [isClicking, setIsClicking] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  
  // Toggle expanded state - memoized to prevent recreation on each render
  const toggleExpand = useCallback((e: React.MouseEvent) => {
    if (isPaid) return;
    
    // Capture the position of the click for ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickPosition({ x, y });
    
    // Trigger click animation
    setIsClicking(true);
    setShowRipple(true);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsClicking(false);
    }, 150);
    
    // Reset ripple after animation completes
    setTimeout(() => {
      setShowRipple(false);
    }, 700);
    
    // Toggle expanded state
    setIsExpanded(prev => !prev);
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
  
  // Get tier-based glow color for ripple effect
  const getTierGlowColor = (tier: number): string => {
    switch (tier) {
      case 0: return "bg-green-500";
      case 1: return "bg-yellow-500";
      case 2: return "bg-amber-500";
      case 3: return "bg-orange-500";
      default: return "bg-red-500";
    }
  };
  
  return (
    <div 
      className={`${positionClasses} z-50 scale-[0.9]`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-testid="ticket-timer"
    >
      <div 
        className={`
          ${roboto.className}
          relative 
          w-40
          cursor-pointer
          bg-black
          rounded-2xl 
          shadow-xl
          overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isHovering ? 'scale-105 shadow-2xl' : 'scale-100'}
          ${isClicking ? 'scale-[0.98] shadow-inner' : ''}
          ${isPaid ? 'border border-green-500/40' : ''}
        `}
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        aria-label={isExpanded ? "Collapse parking ticket details" : "Expand parking ticket details"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.currentTarget.click();
            e.preventDefault();
          }
        }}
      >
        {/* Container with flex column layout */}
        <div className="flex flex-col relative w-full">
          {/* Subtle metallic texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[length:10px_10px] opacity-10 pointer-events-none"></div>
          
          {/* Enhanced gloss effect */}
          <div className={`
            absolute inset-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-300 pointer-events-none
            ${isClicking ? 'opacity-60' : 'opacity-40'}
          `}></div>
          
          {/* Ripple effect on click */}
          {showRipple && (
            <div 
              className={`
                absolute rounded-full 
                ${isPaid ? 'bg-green-500/20' : `${getTierGlowColor(currentTier.tier)}/20`}
                animate-ripple pointer-events-none
              `}
              style={{
                top: clickPosition.y,
                left: clickPosition.x,
                width: '5px',
                height: '5px',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
          
          {/* Main display area - always visible section */}
          <div className="flex flex-col justify-between p-4 space-y-5 relative">
            {/* Digital readout - displays the appropriate price based on hours with matching tier color */}
            <TicketHeader 
              isPaid={isPaid} 
              currentTier={currentTier} 
              paidAmount={paidAmount}
              isClicking={isClicking} 
            />
            
            {/* Progress indicator lights */}
            <ProgressIndicator 
              activeDots={activeDots} 
              isPaid={isPaid} 
              currentTier={currentTier}
              isClicking={isClicking}
            />
          </div>
          
          {/* Expanded content - conditionally rendered */}
          {isExpanded && !isPaid && (
            <div 
              className="px-4 pb-4 pt-2 border-t border-zinc-800/50 transition-all duration-500"
              style={{ 
                animationName: 'slideDown',
                animationDuration: '500ms',
                animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <ExpandedSection 
                timeUntilChange={timeUntilChange} 
                nextTier={nextTier} 
                currentTier={currentTier} 
                handlePayNow={handlePayNow}
                isClicking={isClicking} 
              />
            </div>
          )}
          
          {/* Payment confirmation section */}
          {isPaid && (
            <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50">
              <PaymentConfirmation 
                getPaymentTime={getPaymentTime} 
              />
            </div>
          )}
          
          {/* Expand/collapse indicator with enhanced animation - only show if not paid */}
          {!isPaid && (
            <div className={`
              relative w-5 h-2 mx-auto mb-2
              transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
              ${isHovering ? 'opacity-80' : 'opacity-40'}
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
              ${isClicking ? 'scale-75' : 'scale-100'}
            `}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 10" 
                fill="white"
                className="transition-transform duration-300"
                aria-hidden="true"
              >
                <path d="M0 0 L10 10 L20 0 Z" />
              </svg>
            </div>
          )}
          
          {/* Enhanced dynamic ambient glow based on price tier or paid status */}
          <div className={`
            absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-2xl transition-colors duration-1000 pointer-events-none
            ${isPaid 
              ? 'bg-green-500/30 animate-pulse' 
              : currentTier.tier === 0 
                ? 'bg-green-500/30' 
                : currentTier.tier === 1 
                  ? 'bg-yellow-500/30' 
                  : currentTier.tier === 2 
                    ? 'bg-amber-500/30' 
                    : currentTier.tier === 3 
                      ? 'bg-orange-500/30' 
                      : 'bg-red-500/30'}
            ${isClicking ? 'opacity-60 scale-110' : 'opacity-30 scale-100'}
          `}></div>
        </div>
      </div>
    </div>
  );
};

export default TicketTimer; 