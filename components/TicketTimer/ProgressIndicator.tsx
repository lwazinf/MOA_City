import React from 'react';
import { TierInfo } from '@/lib/constants';

interface ProgressIndicatorProps {
  activeDots: number;
  isPaid: boolean;
  currentTier: TierInfo;
}

/**
 * Displays the circular progress indicator dots showing time progression
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  activeDots, 
  isPaid, 
  currentTier 
}) => {
  // Get price tier color based on current tier
  const getPriceColor = (tier: number): string => {
    switch (tier) {
      case 0: return "bg-green-400"; // R10
      case 1: return "bg-yellow-400"; // R20
      case 2: return "bg-amber-400"; // R30
      case 3: return "bg-orange-400"; // R50
      default: return "bg-red-400"; // R80
    }
  };
  
  // Get glow color based on current tier
  const getGlowColor = (tier: number): string => {
    switch (tier) {
      case 0: return "rgba(74, 222, 128, 0.8)"; // R10
      case 1: return "rgba(250, 204, 21, 0.8)"; // R20
      case 2: return "rgba(251, 146, 60, 0.8)"; // R30
      case 3: return "rgba(249, 115, 22, 0.8)"; // R50
      default: return "rgba(248, 113, 113, 0.8)"; // R80
    }
  };

  return (
    <div 
      className="flex justify-center space-x-1 mb-6"
      role="progressbar"
      aria-valuenow={Math.round((activeDots / 9) * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={isPaid ? "Payment complete" : "Time progression"}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        // Determine if light should be active based on current tier progression
        const isActive = i <= activeDots;
        
        // Different colors and styles when paid
        if (isPaid) {
          return (
            <div
              key={i}
              className={`
                w-1.5 h-1.5 rounded-full 
                transition-all duration-300
                ${i === 9 
                  ? 'bg-green-400 shadow-[0_0_7px_2px_rgba(74,222,128,0.8)] animate-pulse' 
                  : 'bg-green-400/70'}
              `}
              aria-hidden="true"
            />
          );
        }
        
        // Check if this is the leading dot (last active dot)
        const isLeadingDot = Math.abs(i - activeDots) < 0.5;
        
        const activeColor = getPriceColor(currentTier.tier);
        const glowColor = getGlowColor(currentTier.tier);
    
        return (
          <div
            key={i}
            className={`
              w-1.5 h-1.5 rounded-full 
              transition-all duration-300
              ${isActive 
                ? isLeadingDot 
                  ? `${activeColor} shadow-[0_0_7px_2px_${glowColor}] animate-pulse`
                  : i >= 7
                    ? `${activeColor} shadow-[0_0_5px_1px_${glowColor}]`
                    : 'bg-white/70'
                : 'bg-zinc-700'}
            `}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
};

export default React.memo(ProgressIndicator); 