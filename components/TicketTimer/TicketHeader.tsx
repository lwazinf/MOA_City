import React from 'react';
import { TierInfo } from '@/lib/constants';
import { getTierTextColor, getTierTextGlow } from '@/lib/styleUtils';
import { getTimeUntilChange } from '@/lib/timerUtils';

interface TicketHeaderProps {
  isPaid: boolean;
  currentTier: TierInfo;
  paidAmount: string;
}

/**
 * Displays the price and remaining time information at the top of the ticket
 */
const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  isPaid, 
  currentTier, 
  paidAmount 
}) => {
  return (
    <div className="flex flex-col items-end mt-2 mr-2">
      {isPaid ? (
        <div>
          <div 
            className="text-green-400 font-mono text-2xl font-bold tracking-wider"
            style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.8)' }}
          >
            {paidAmount}
          </div>
          <div className="text-gray-400 text-xs mt-0.5 font-mono opacity-70">
            Paid
          </div>
        </div>
      ) : (
        <>
          <div 
            className={`${getTierTextColor(currentTier.tier)} font-mono text-2xl font-bold tracking-wider transition-all duration-300 ${currentTier.price.length > 3 ? 'text-xl' : ''}`}
            style={{ textShadow: `0 0 8px ${getTierTextGlow(currentTier.tier)}` }}
            aria-label={`Current rate: ${currentTier.price}`}
          >
            {currentTier.price}
          </div>
          
          {/* Time until next change indicator */}
          {currentTier.tier < 4 && (
            <div 
              className="text-gray-400 text-xs mt-0.5 font-mono opacity-70"
              aria-label={`Time until price change: ${getTimeUntilChange(currentTier, currentTier.startMinute)}`}
            >
              {getTimeUntilChange(currentTier, currentTier.startMinute)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(TicketHeader); 