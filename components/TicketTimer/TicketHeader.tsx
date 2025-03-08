import React from 'react';
import { TierInfo } from '@/lib/constants';
import { getTierTextColor, getTierTextGlow } from '@/lib/styleUtils';
import { getTimeUntilChange } from '@/lib/timerUtils';

interface TicketHeaderProps {
  isPaid: boolean;
  currentTier: TierInfo;
  paidAmount: string;
  isClicking?: boolean;
}

/**
 * Displays the price and remaining time information at the top of the ticket
 */
const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  isPaid, 
  currentTier, 
  paidAmount,
  isClicking = false
}) => {
  return (
    <div className={`
      flex flex-col
      transition-all duration-150
      ${isClicking ? 'transform scale-95' : ''}
    `}>
      {isPaid ? (
        <div className="transition-all duration-500">
          <div 
            className="text-green-500 text-2xl font-bold tracking-wide"
            style={{ 
              textShadow: `0 0 ${isClicking ? '15px' : '10px'} rgba(74, 222, 128, ${isClicking ? '0.9' : '0.8'})`,
              transition: 'all 0.3s ease-out' 
            }}
          >
            {paidAmount}
          </div>
          <div 
            className={`
              text-gray-500 text-xs mt-0.5 tracking-wide
              ${isClicking ? 'text-green-300' : 'text-gray-500'}
            `}
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
              textShadow: `0 0 ${isClicking ? '15px' : '10px'} ${getTierTextGlow(currentTier.tier)}`,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            }}
            aria-label={`Current rate: ${currentTier.price}`}
          >
            {currentTier.price}
          </div>
          
          {/* Time since start indicator */}
          <div 
            className={`
              text-xs mt-0.5 transition-all duration-300
              ${isClicking ? getTierTextColor(currentTier.tier) : 'text-gray-500'}
            `}
            style={{ 
              transition: 'all 0.3s ease-out',
              opacity: isClicking ? 0.8 : 0.6
            }}
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