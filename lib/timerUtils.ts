import { PriceTier, TierInfo, TimeUntilChange } from "./constants";

/**
 * Get current price tier based on minutes elapsed
 */
export const getCurrentTier = (currentMinute: number, priceTiers: PriceTier[]): TierInfo => {
  for (let i = 0; i < priceTiers.length; i++) {
    if (currentMinute < priceTiers[i].maxMinutes) {
      return {
        tier: i,
        price: priceTiers[i].price,
        startMinute: i === 0 ? 0 : priceTiers[i - 1].maxMinutes,
        endMinute: priceTiers[i].maxMinutes
      };
    }
  }
  return {
    tier: priceTiers.length - 1,
    price: priceTiers[priceTiers.length - 1].price,
    startMinute: priceTiers[priceTiers.length - 2].maxMinutes,
    endMinute: priceTiers[priceTiers.length - 1].maxMinutes
  };
};

/**
 * Get next tier information
 */
export const getNextTierInfo = (currentTier: TierInfo, priceTiers: PriceTier[]) => {
  if (currentTier.tier >= priceTiers.length - 1) {
    return null; // No next tier
  }
  
  return {
    price: priceTiers[currentTier.tier + 1].price,
    startMinute: currentTier.endMinute
  };
};

/**
 * Calculate time until next tier change
 */
export const getTimeUntilChange = (currentTier: TierInfo, currentMinute: number): string => {
  if (currentTier.tier === 4) { // Last tier
    return ''; // No next change
  }
  
  const minutesLeft = currentTier.endMinute - currentMinute;
  const hours = Math.floor(minutesLeft / 60);
  const minutes = minutesLeft % 60;
  
  return hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;
};

/**
 * Get detailed time until next tier change
 */
export const getDetailedTimeUntilChange = (
  currentTier: TierInfo, 
  currentMinute: number
): TimeUntilChange | null => {
  if (currentTier.tier === 4) { // Last tier
    return null; // No next change
  }
  
  const minutesLeft = currentTier.endMinute - currentMinute;
  const hours = Math.floor(minutesLeft / 60);
  const minutes = minutesLeft % 60;
  
  return {
    hours,
    minutes,
    totalMinutes: minutesLeft,
    percentage: (minutesLeft / (currentTier.endMinute - currentTier.startMinute)) * 100
  };
};

/**
 * Calculate how many indicator dots should be lit
 */
export const calculateActiveDots = (
  currentTier: TierInfo,
  currentMinute: number,
  animationFrame: number,
  isPaid: boolean
): number => {
  // If paid, show all dots lit
  if (isPaid) return 9;
  
  const { startMinute, endMinute } = currentTier;
  const tierDuration = endMinute - startMinute;
  const minutesInCurrentTier = currentMinute - startMinute;
  
  // Calculate percentage through current tier
  const percentComplete = minutesInCurrentTier / tierDuration;
  
  // Convert to dots (0-9), adding a partial dot based on animation frame
  const baseDots = Math.min(9, Math.floor(percentComplete * 10));
  const partialDot = (percentComplete * 10) % 1;
  
  // Add animation frame contribution for smoother movement
  const animationContribution = (animationFrame / 20) * 0.1; // Subtle movement
  
  return Math.min(9, baseDots + (partialDot > 0 ? animationContribution : 0));
}; 