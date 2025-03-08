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
      <div className="flex flex-col h-full pb-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-400 text-xs">Next Rate:</span>
          <span 
            className={`${getNextTierTextColor(currentTier.tier + 1)} text-sm font-medium`}
            aria-label={`Next rate: ${nextTier.price}`}
          >
            {nextTier.price}
          </span>
        </div>
        
        <div className="text-gray-400 text-xs mb-2">
          Time until rate change:
        </div>
        
        {/* Progress bar for time remaining */}
        <div 
          className="h-3 bg-zinc-800/50 rounded-full overflow-hidden mb-3 relative"
          role="progressbar"
          aria-valuenow={timeUntilChange.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div 
            className={`h-full rounded-full ${getTierTextColor(currentTier.tier)} opacity-30`}
            style={{ width: `${timeUntilChange.percentage}%` }}
          ></div>
          
          {/* Animated pulse at the edge of progress */}
          <div 
            className={`absolute top-0 h-full w-1 ${getTierTextColor(currentTier.tier)} opacity-50 animate-pulse-slow`}
            style={{ left: `${timeUntilChange.percentage}%`, transform: 'translateX(-50%)' }}
          ></div>
        </div>
        
        {/* Detailed countdown display */}
        <div 
          className="flex justify-center items-center mb-4"
          aria-label={`${timeUntilChange.hours} hours and ${timeUntilChange.minutes} minutes until rate change`}
        >
          <div className="flex gap-2 text-center">
            <div className="flex flex-col">
              <div className="text-white text-xl font-medium">{timeUntilChange.hours}</div>
              <div className="text-gray-500 text-xs">hours</div>
            </div>
            <div className="text-gray-500 text-xl">:</div>
            <div className="flex flex-col">
              <div className="text-white text-xl font-medium">{timeUntilChange.minutes.toString().padStart(2, '0')}</div>
              <div className="text-gray-500 text-xs">minutes</div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <PayButton 
          handlePayNow={handlePayNow} 
          currentTier={currentTier} 
        />
      </div>
    );
  }

  // Display for maximum tier
  return (
    <div className="flex flex-col h-full justify-between pb-10">
      <div>
        <div className="text-gray-400 text-sm">
          Maximum daily rate
        </div>
        <div className="text-white text-xs mt-2 opacity-60 mb-4">
          No additional charges
        </div>
      </div>

      {/* Pay Now Button for maximum rate */}
      <PayButton 
        handlePayNow={handlePayNow} 
        currentTier={currentTier} 
      />
    </div>
  );
};

interface PayButtonProps {
  handlePayNow: (e: React.MouseEvent) => void;
  currentTier: TierInfo;
}

/**
 * Reusable Pay Now button component
 */
const PayButton: React.FC<PayButtonProps> = ({ handlePayNow, currentTier }) => (
  <button
    onClick={handlePayNow}
    className={`
      w-full py-2 rounded-lg font-medium text-sm text-white
      ${getTierBgColor(currentTier.tier)}
      transition-all duration-300 
      hover:brightness-110 active:brightness-90
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-opacity-50 focus:ring-white
      flex items-center justify-center gap-1
      shadow-md
    `}
    aria-label={`Pay ${currentTier.price} now`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
    Pay Now
  </button>
);

export default React.memo(ExpandedSection); 