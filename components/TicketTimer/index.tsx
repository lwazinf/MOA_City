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
  
  // Track if the ticket has been scanned
  const [isTicketScanned, setIsTicketScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Track time in minutes (0-1440 for 24 hours)
  const [currentMinute, setCurrentMinute] = useState(initialMinutes);
  const [paidAmount, setPaidAmount] = useState("");
  
  // Used for the animation frame
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // State for animation transitions
  const [isClicking, setIsClicking] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  const [isAnimatingTransition, setIsAnimatingTransition] = useState(false);
  
  // State for fade out animation after payment
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // Toggle expanded state - memoized to prevent recreation on each render
  const toggleExpand = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if (isPaid || !isTicketScanned || isAnimatingTransition) return;
    
    // Set transition flag to prevent multiple toggles during animation
    setIsAnimatingTransition(true);
    
    // Capture the position of the click for ripple effect
    if (e.type === 'click') {
      const mouseEvent = e as React.MouseEvent;
      const rect = mouseEvent.currentTarget.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      setClickPosition({ x, y });
    } else {
      // For keyboard events, just use the center of the element
      setClickPosition({ x: 20, y: 60 });
    }
    
    // Trigger click animation
    setIsClicking(true);
    setShowRipple(true);
    
    // Reset click animation after a short delay
    setTimeout(() => {
      setIsClicking(false);
    }, 150);
    
    // Reset ripple after animation completes
    setTimeout(() => {
      setShowRipple(false);
    }, 700);
    
    // Toggle expanded state with a delay for better animation sequencing
    setTimeout(() => {
      setIsExpanded(prev => !prev);
      
      // Allow new transitions after the animation is complete
      setTimeout(() => {
        setIsAnimatingTransition(false);
      }, 600); // Match this with the duration of the expansion animation
    }, 50);
    
  }, [isPaid, isTicketScanned, isAnimatingTransition]);

  // Reset component to initial state
  const resetComponent = useCallback(() => {
    // Mark the component as resetting to prevent double rendering of scanner
    setIsResetting(true);
    
    // Fade out the component completely
    setTimeout(() => {
      // First, set states that affect visibility
      setIsFadingOut(false);
      
      // Complete removal of all components - use a hidden state
      const completelyHidden = setTimeout(() => {
        // Reset all states to their initial values
        setIsPaid(false);
        setCurrentMinute(initialMinutes);
        setPaidAmount("");
        setAnimationFrame(0);
        setIsExpanded(defaultExpanded);
        setIsTicketScanned(false);
        
        // After a clean break, show the scanner again
        setTimeout(() => {
          // Re-enable animations and interactions
          setIsResetting(false);
          setIsAnimatingTransition(false);
        }, 100);
      }, 500); // Complete removal delay
      
      return () => clearTimeout(completelyHidden);
    }, 800); // Fade out animation completion
  }, [defaultExpanded, initialMinutes]);

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
    
    // Set transition animation flag
    setIsAnimatingTransition(true);
    
    // Short delay before showing payment confirmation
    setTimeout(() => {
      setIsPaid(true);
      setTimeout(() => {
        setIsAnimatingTransition(false);
      }, 500);
    }, 400);
    
    // Call the onPayment callback if provided
    if (onPayment) {
      onPayment(amount);
    }
  }, [currentTier, onPayment]);
  
  // Handle ticket scan - simulates scanning a ticket
  const handleTicketScan = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent multiple scans
    if (isScanning || isAnimatingTransition) return;
    
    // Set transition animation flag
    setIsAnimatingTransition(true);
    
    // Show scanning animation
    setIsScanning(true);
    
    // Simulate API call to scan ticket (with a timeout to simulate processing)
    setTimeout(() => {
      // In a real app, this would set initialMinutes based on API response
      // For demo, we'll just start the timer from the initialMinutes prop
      setIsTicketScanned(true);
      setIsScanning(false);
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        setIsAnimatingTransition(false);
      }, 500);
    }, 2000);
  }, [isScanning, isAnimatingTransition]);
  
  // Effect to reset the component after payment
  useEffect(() => {
    if (isPaid && !isFadingOut && !isResetting) {
      // After 4 seconds (reduced from 8), start fade out animation
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
        
        // After fade out animation starts, prepare to reset component
        const resetTimer = setTimeout(() => {
          resetComponent();
        }, 1000); // 1 second for the fade out animation to start properly
        
        return () => clearTimeout(resetTimer);
      }, 4000); // 4 seconds after payment (reduced from 8)
      
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isPaid, isFadingOut, isResetting, resetComponent]);
  
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
  
  // Animate the minutes and indicator lights - only if not paid and ticket is scanned
  useEffect(() => {
    // Skip animation if paid or ticket not scanned or component is resetting
    if (isPaid || !isTicketScanned || isResetting) return;
    
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
  }, [animationFrame, isPaid, isTicketScanned, isResetting]);
  
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
          ${isClicking ? 'scale-[0.95] shadow-inner rotate-1' : ''}
          ${isExpanded ? 'scale-100' : 'scale-[0.97]'}
          ${isPaid ? 'border border-green-500/40' : ''}
          ${!isTicketScanned && isScanning ? 'animate-pulse' : ''}
          ${isFadingOut ? 'animate-fade-out' : ''}
          ${!isTicketScanned && !isAnimatingTransition && !isResetting ? 'animate-bounce-in' : ''}
          ${isResetting && isFadingOut ? 'opacity-0' : ''}
        `}
        onClick={isTicketScanned && !isAnimatingTransition ? toggleExpand : undefined}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        aria-label={!isTicketScanned ? "Scan your parking ticket" : isExpanded ? "Collapse parking ticket details" : "Expand parking ticket details"}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (isTicketScanned && !isAnimatingTransition) {
              toggleExpand(e);
            }
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
            ${isClicking ? 'opacity-70 translate-y-1' : 'opacity-40'}
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
          
          {!isTicketScanned ? (
            // Ticket Scanner UI
            <div className="flex flex-col items-center justify-center p-5 h-full relative">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-500/5 animate-gradient-shift opacity-30 pointer-events-none"></div>
              
              {/* Scanner graphic lines */}
              <div className="absolute inset-x-0 top-0 h-8 overflow-hidden opacity-20 pointer-events-none">
                <div className="w-full h-[1px] bg-blue-400 animate-scan-line-1"></div>
                <div className="w-full h-[1px] bg-blue-400 animate-scan-line-2"></div>
              </div>
              
              {/* Ticket scan message with dynamic effects */}
              <div className="mb-4 relative z-10">
                <div className="relative">
                  <h3 className="text-white font-medium text-center mb-2 animate-pulse-text relative">
                    <span className="relative z-10">Scan Parking Ticket</span>
                    <span className="absolute inset-0 blur-sm bg-blue-500/5 z-0 animate-pulse-glow"></span>
                  </h3>
                  
                  <p className="text-blue-200/70 text-xs text-center px-1 max-w-[120px] mx-auto">
                    Capture your ticket to check time & payment
                  </p>
                </div>
                
                {/* Small icon indicators */}
                <div className="flex justify-center mt-3 space-x-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-400/50 animate-blink-slow"></div>
                  <div className="w-1 h-1 rounded-full bg-blue-400/50 animate-blink-slow" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-1 h-1 rounded-full bg-blue-400/50 animate-blink-slow" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
              
              {/* Enhanced camera button with glow effects */}
              <button 
                className={`
                  relative
                  bg-gradient-to-b from-blue-500 to-blue-600
                  rounded-full w-[72px] h-[72px] 
                  flex items-center justify-center
                  transition-all duration-300
                  shadow-lg
                  transform hover:scale-105 active:scale-95
                  ${isScanning ? 'animate-scanning-pulse' : ''}
                  ${!isAnimatingTransition && !isResetting ? 'animate-float' : ''}
                  group
                  outline-none
                  focus:ring-4 focus:ring-blue-500/30
                `}
                onClick={handleTicketScan}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                disabled={isScanning || isAnimatingTransition}
                aria-label="Scan parking ticket"
              >
                {/* Outer glow ring */}
                <div className={`
                  absolute inset-0 rounded-full 
                  bg-blue-500/0 
                  transition-all duration-300
                  ${isButtonHovered ? 'bg-blue-500/10 scale-110' : ''}
                  ${isScanning ? 'animate-ping-slow opacity-40' : 'opacity-0'}
                `}></div>
                
                {/* Inner gradient border */}
                <div className="absolute inset-0 rounded-full border border-blue-400/30 group-hover:border-blue-400/50 transition-colors duration-300"></div>
                
                <div className="relative">
                  {/* Camera icon with dynamic effects */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-white transform transition-transform duration-300 group-hover:scale-105" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{
                      filter: "drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))"
                    }}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  
                  {/* Scanning animation if active */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-white/80 animate-scanning-line"></div>
                      <div className="absolute inset-0 animate-scanning-flash"></div>
                    </div>
                  )}
                </div>
                
                {/* Lens flare effect */}
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/60 blur-[0.5px]"></div>
              </button>
              
              {/* Scanning message with typing animation */}
              {isScanning && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="text-blue-400 text-xs animate-pulse mr-1">
                    Scanning
                  </div>
                  <div className="flex items-center">
                    <span className="animate-typing-dot opacity-60 delay-0"></span>
                    <span className="animate-typing-dot opacity-60 delay-300"></span>
                    <span className="animate-typing-dot opacity-60 delay-600"></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Main Timer UI (only shown after ticket is scanned)
            <>
              {/* Main display area - always visible section */}
              <div 
                className={`
                  flex flex-col justify-between p-4 space-y-5 relative
                  transition-all duration-500
                  ${isExpanded ? '' : 'pb-2'}
                `}
              >
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
                  className="px-4 pb-4 pt-2 border-t border-zinc-800/50 animate-slide-in"
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
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50 animate-slide-in">
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
                  ${isExpanded ? 'rotate-180 scale-90' : 'rotate-0 animate-bounce-gentle'}
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
            </>
          )}
          
          {/* Enhanced dynamic ambient glow based on price tier or paid status */}
          <div className={`
            absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-2xl transition-colors duration-1000 pointer-events-none
            ${!isTicketScanned
              ? 'bg-blue-500/30 animate-pulse-glow' 
              : isPaid 
                ? 'bg-green-500/30 animate-pulse-glow' 
                : currentTier.tier === 0 
                  ? 'bg-green-500/30' 
                  : currentTier.tier === 1 
                    ? 'bg-yellow-500/30' 
                    : currentTier.tier === 2 
                      ? 'bg-amber-500/30' 
                      : currentTier.tier === 3 
                        ? 'bg-orange-500/30' 
                        : 'bg-red-500/30'}
            ${isClicking ? 'opacity-70 scale-125' : 'opacity-30 scale-100'}
          `}></div>
        </div>
      </div>
    </div>
  );
};

export default TicketTimer; 