import React, { useState } from 'react';
import { TierInfo, TimeUntilChange } from '@/lib/constants';
import { getNextTierTextColor } from '@/lib/styleUtils';

interface ExpandedSectionProps {
  timeUntilChange: TimeUntilChange | null;
  nextTier: { price: string; startMinute: number } | null;
  currentTier: TierInfo;
  handlePayNow: (e: React.MouseEvent) => void;
  isClicking?: boolean;
}

/**
 * Displays detailed information about time remaining and next price tier
 * when the ticket is expanded
 */
const ExpandedSection: React.FC<ExpandedSectionProps> = ({
  timeUntilChange,
  nextTier,
  currentTier,
  handlePayNow,
  isClicking = false
}) => {
  // State for tracking time digit click effects
  const [hourClicked, setHourClicked] = useState(false);
  const [minuteClicked, setMinuteClicked] = useState(false);
  
  // Handle time digit click (purely for visual effect)
  const handleHourClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container click
    setHourClicked(true);
    setTimeout(() => setHourClicked(false), 300);
  };
  
  const handleMinuteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container click
    setMinuteClicked(true);
    setTimeout(() => setMinuteClicked(false), 300);
  };
  
  if (timeUntilChange && nextTier) {
    return (
      <div className={`
        flex flex-col w-full space-y-3
        transition-all duration-150
        ${isClicking ? 'opacity-90 transform scale-98' : 'opacity-100 transform-none'}
      `}>
        {/* Next rate info */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/80">Next Rate:</span>
          <span 
            className={`${getNextTierTextColor(currentTier.tier + 1)} font-medium transition-all duration-300 text-[16px]`}
            aria-label={`Next rate: ${nextTier.price}`}
          >
            {nextTier.price}
          </span>
        </div>
        
        {/* Time until change info */}
        <div className="text-white/80 font-black text-xs">
          Time until rate change:
        </div>
        
        
        
        {/* Timer display */}
        <div className="flex justify-center items-center space-x-2 mt-1">
          {/* Hours */}
          <div 
            className={`
              bg-zinc-900 rounded-md px-2 py-1.5 w-12 text-center 
              border border-zinc-800 
              transition-all duration-300 
              transform hover:scale-105 
              shadow-lg
              ${hourClicked ? 'bg-zinc-800 scale-95 shadow-inner' : ''}
            `}
            onClick={handleHourClick}
          >
            <span className={`
              text-white text-xl font-medium transition-all duration-200
              ${hourClicked ? 'text-green-400' : ''}
            `}>
              {String(timeUntilChange.hours).padStart(2, '0')}
            </span>
          </div>
          
          {/* Separator */}
          <span className={`
            text-white text-xl font-light animate-pulse-slow
            ${isClicking ? 'opacity-100' : 'opacity-70'}
          `}>:</span>
          
          {/* Minutes */}
          <div 
            className={`
              bg-zinc-900 rounded-md px-2 py-1.5 w-12 text-center 
              border border-zinc-800 
              transition-all duration-300 
              transform hover:scale-105 
              shadow-lg
              ${minuteClicked ? 'bg-zinc-800 scale-95 shadow-inner' : ''}
            `}
            onClick={handleMinuteClick}
          >
            <span className={`
              text-white text-xl font-medium transition-all duration-200
              ${minuteClicked ? 'text-green-400' : ''}
            `}>
              {String(timeUntilChange.minutes).padStart(2, '0')}
            </span>
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-center text-center text-gray-500 text-xs -mt-1">
          <div className="w-12">hours</div>
          <div className="w-12 ml-6">minutes</div>
        </div>
        
        {/* Pay button */}
        <div className="mt-3">
          <PayButton 
            handlePayNow={handlePayNow} 
            currentTier={currentTier} 
          />
        </div>
      </div>
    );
  }
  
  // If no next tier (last tier)
  return (
    <div className={`
      flex flex-col w-full space-y-4
      transition-all duration-150
      ${isClicking ? 'opacity-90 transform scale-98' : 'opacity-100 transform-none'}
    `}>
      <div className="text-center text-gray-400 text-sm">
        Maximum rate reached
      </div>
      
      <div className="mt-2">
        <PayButton 
          handlePayNow={handlePayNow} 
          currentTier={currentTier} 
        />
      </div>
    </div>
  );
};

interface PayButtonProps {
  handlePayNow: (e: React.MouseEvent) => void;
  currentTier: TierInfo;
}

/**
 * Get button background color based on tier
 */
const getTierButtonColor = (tier: number): string => {
  switch (tier) {
    case 0: return "bg-green-500 hover:bg-green-600 active:bg-green-700"; // R10
    case 1: return "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700"; // R20
    case 2: return "bg-amber-500 hover:bg-amber-600 active:bg-amber-700"; // R30
    case 3: return "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"; // R50
    default: return "bg-red-500 hover:bg-red-600 active:bg-red-700"; // R80
  }
};

/**
 * Get button ring color based on tier
 */
const getTierRingColor = (tier: number): string => {
  switch (tier) {
    case 0: return "focus:ring-green-500"; // R10
    case 1: return "focus:ring-yellow-500"; // R20
    case 2: return "focus:ring-amber-500"; // R30
    case 3: return "focus:ring-orange-500"; // R50
    default: return "focus:ring-red-500"; // R80
  }
};

/**
 * Get button text color based on tier
 * Use white text for darker colors (orange, red)
 * Use black text for lighter colors (green, yellow, amber)
 */
const getButtonTextColor = (tier: number): string => {
  // Use white text for orange and red (better contrast)
  if (tier >= 3) return "text-white";
  // Use black text for green, yellow, and amber
  return "text-black";
};

/**
 * Payment button with appropriate styling based on tier
 */
const PayButton: React.FC<PayButtonProps> = ({ handlePayNow, currentTier }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  
  // Enhanced button click with ripple effect
  const handleButtonClick = (e: React.MouseEvent) => {
    // Get click position for ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipplePosition({ x, y });
    
    // Activate ripple and button press state
    setShowRipple(true);
    setIsButtonClicked(true);
    
    // Call the original handler
    handlePayNow(e);
    
    // Reset animations after they complete
    setTimeout(() => {
      setIsButtonClicked(false);
      setTimeout(() => {
        setShowRipple(false);
      }, 500);
    }, 300);
  };
  
  // Determine ripple color based on text color
  const rippleColor = currentTier.tier >= 3 ? "bg-white/10" : "bg-black/10";
  
  return (
    <button 
      className={`
        ${getTierButtonColor(currentTier.tier)}
        ${getButtonTextColor(currentTier.tier)}
        w-full py-2.5 rounded-md 
        font-medium text-sm
        transition-all duration-300 transform 
        hover:scale-[1.02] 
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 ${getTierRingColor(currentTier.tier)} focus:ring-offset-2 focus:ring-offset-black
        group relative overflow-hidden
        ${isButtonClicked ? 'scale-[0.98] shadow-inner' : ''}
      `}
      onClick={handleButtonClick}
      aria-label={`Pay now: ${currentTier.price}`}
    >
      {/* Ripple effect */}
      {showRipple && (
        <div 
          className={`absolute ${rippleColor} animate-button-ripple rounded-full pointer-events-none`}
          style={{
            top: ripplePosition.y,
            left: ripplePosition.x,
            width: '5px',
            height: '5px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
        
      <div className="flex items-center justify-center relative">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`
            h-4 w-4 mr-1.5 
            transition-all duration-300 
            group-hover:translate-x-0.5
            ${isButtonClicked ? 'translate-x-1 scale-110' : ''}
          `}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        Pay Now
      </div>
    </button>
  );
};

export default React.memo(ExpandedSection); 