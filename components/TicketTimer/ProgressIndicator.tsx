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
      case 0: return "bg-green-500"; // R10
      case 1: return "bg-yellow-500"; // R20
      case 2: return "bg-amber-500"; // R30
      case 3: return "bg-orange-500"; // R50
      default: return "bg-red-500"; // R80
    }
  };
  
  // Get glow color based on current tier
  const getGlowColor = (tier: number): string => {
    switch (tier) {
      case 0: return "rgba(74, 222, 128, 0.9)"; // R10
      case 1: return "rgba(250, 204, 21, 0.9)"; // R20
      case 2: return "rgba(251, 146, 60, 0.9)"; // R30
      case 3: return "rgba(249, 115, 22, 0.9)"; // R50
      default: return "rgba(248, 113, 113, 0.9)"; // R80
    }
  };

  return (
    <div className="flex justify-center space-x-1.5 mt-2">
      {Array.from({ length: 10 }).map((_, i) => {
        // Determine if light should be active
        const isActive = isPaid ? (i === 0 || i % 3 === 0) : i < activeDots;
        const isPulse = isPaid && (i === 0 || i % 3 === 0);
        
        // Add staggered animation delays
        const baseDelayMs = isPaid ? 300 : 0;
        const pulseDelay = `${baseDelayMs + (i * 100)}ms`;
        
        // Check if this is the leading dot (last active dot)
        const isLeadingDot = !isPaid && Math.abs(i - activeDots) < 0.5;
        
        return (
          <div 
            key={i}
            className="relative"
          >
            {/* Outer circle (always visible) */}
            <div 
              className={`
                h-1.5 w-1.5 rounded-full 
                ${isActive ? 'bg-zinc-700' : 'bg-zinc-800'}
                transition-all duration-300 ease-in-out
              `}
            ></div>
            
            {/* Active state inner circle */}
            <div 
              className={`
                absolute top-0 left-0 
                h-1.5 w-1.5 rounded-full
                transition-all duration-500 ease-in-out
                ${isActive ? getPriceColor(currentTier.tier) : 'bg-transparent opacity-0'}
                ${isPulse || isLeadingDot ? 'animate-pulse' : ''}
              `} 
              style={{ 
                boxShadow: isActive ? `0 0 8px ${getGlowColor(currentTier.tier)}` : 'none',
                animationDelay: isPulse ? pulseDelay : '0ms',
                transitionDelay: `${i * 40}ms`
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ProgressIndicator); 