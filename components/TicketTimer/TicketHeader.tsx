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
    <div className="flex flex-col">
      {isPaid ? (
        <div className="transition-all duration-500">
          <div 
            className="text-green-500 text-2xl font-bold tracking-wide"
            style={{ 
              textShadow: '0 0 10px rgba(74, 222, 128, 0.8)',
              transition: 'all 0.3s ease-out' 
            }}
          >
            {paidAmount}
          </div>
          <div 
            className="text-gray-500 text-xs mt-0.5 tracking-wide"
            style={{ transition: 'all 0.3s ease-out' }}
          >
            Paid
          </div>
        </div>
      ) : (
        <>
          <div 
            className={`${getTierTextColor(currentTier.tier)} text-2xl font-bold tracking-wide transition-all duration-500`}
            style={{ 
              textShadow: `0 0 10px ${getTierTextGlow(currentTier.tier)}`,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            }}
            aria-label={`Current rate: ${currentTier.price}`}
          >
            {currentTier.price}
          </div>
          
          {/* Time since start indicator */}
          <div 
            className="text-gray-500 text-xs mt-0.5 transition-all duration-300"
            style={{ transition: 'all 0.3s ease-out' }}
            aria-label={`Time elapsed: ${getTimeUntilChange(currentTier, currentTier.startMinute)}`}
          >
            {getTimeUntilChange(currentTier, currentTier.startMinute)}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(TicketHeader); 