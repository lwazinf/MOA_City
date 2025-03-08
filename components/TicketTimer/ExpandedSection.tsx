import React from 'react';
import { TierInfo, TimeUntilChange } from '@/lib/constants';
import { getTierTextColor, getTierBgColor, getNextTierTextColor } from '@/lib/styleUtils';

interface ExpandedSectionProps {
  timeUntilChange: TimeUntilChange | null;
  nextTier: { price: string; startMinute: number } | null;
  currentTier: TierInfo;
  handlePayNow: (e: React.MouseEvent) => void;
}

/**
 * Displays detailed information about time remaining and next price tier
 * when the ticket is expanded
 */
const ExpandedSection: React.FC<ExpandedSectionProps> = ({
  timeUntilChange,
  nextTier,
  currentTier,
  handlePayNow
}) => {
  if (timeUntilChange && nextTier) {
    return (
      <div className="flex flex-col w-full space-y-3">
        {/* Next rate info */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Next Rate:</span>
          <span 
            className={`${getNextTierTextColor(currentTier.tier + 1)} font-medium transition-all duration-300`}
            aria-label={`Next rate: ${nextTier.price}`}
          >
            {nextTier.price}
          </span>
        </div>
        
        {/* Time until change info */}
        <div className="text-gray-500 text-xs">
          Time until rate change:
        </div>
        
        {/* Progress bar for time remaining */}
        <div 
          className="h-2 bg-zinc-900/80 rounded-full overflow-hidden mb-2 relative shadow-inner"
          role="progressbar"
          aria-valuenow={timeUntilChange.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className={`h-full rounded-full ${getTierTextColor(currentTier.tier)} opacity-40 transition-all duration-1000 ease-in-out`}
            style={{ width: `${timeUntilChange.percentage}%` }}
          ></div>
          
          {/* Animated pulse at the edge of progress */}
          <div 
            className={`absolute top-0 h-full w-1 ${getTierTextColor(currentTier.tier)} opacity-70 animate-pulse`}
            style={{ 
              left: `${timeUntilChange.percentage}%`, 
              transform: 'translateX(-50%)',
              boxShadow: `0 0 6px 2px ${getTierTextColor(currentTier.tier)}` 
            }}
          ></div>
        </div>
        
        {/* Timer display */}
        <div className="flex justify-center items-center space-x-2 mt-1">
          {/* Hours */}
          <div 
            className="bg-zinc-900 rounded-md px-2 py-1.5 w-12 text-center border border-zinc-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="text-white text-xl font-medium transition-all duration-200">
              {String(timeUntilChange.hours).padStart(2, '0')}
            </span>
          </div>
          
          {/* Separator */}
          <span className="text-white text-xl font-light animate-pulse-slow">:</span>
          
          {/* Minutes */}
          <div 
            className="bg-zinc-900 rounded-md px-2 py-1.5 w-12 text-center border border-zinc-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="text-white text-xl font-medium transition-all duration-200">
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
          <PayButton handlePayNow={handlePayNow} currentTier={currentTier} />
        </div>
      </div>
    );
  }
  
  // If no next tier (last tier)
  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="text-center text-gray-400 text-sm">
        Maximum rate reached
      </div>
      
      <div className="mt-2">
        <PayButton handlePayNow={handlePayNow} currentTier={currentTier} />
      </div>
    </div>
  );
};

interface PayButtonProps {
  handlePayNow: (e: React.MouseEvent) => void;
  currentTier: TierInfo;
}

/**
 * Payment button with appropriate styling based on tier
 */
const PayButton: React.FC<PayButtonProps> = ({ handlePayNow, currentTier }) => (
  <button 
    className={`
      bg-green-500 
      hover:bg-green-600 active:bg-green-700
      w-full py-2.5 rounded-md 
      text-white font-medium text-sm
      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
      shadow-md hover:shadow-lg
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black
      group
    `}
    onClick={handlePayNow}
    aria-label={`Pay now: ${currentTier.price}`}
  >
    <div className="flex items-center justify-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover:translate-x-0.5" 
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

export default React.memo(ExpandedSection); 