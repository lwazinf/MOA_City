/**
 * Get tier-based text color
 */
export const getTierTextColor = (tier: number): string => {
  switch (tier) {
    case 0: return "text-green-400";
    case 1: return "text-yellow-400";
    case 2: return "text-amber-400";
    case 3: return "text-orange-400";
    default: return "text-red-400";
  }
};

/**
 * Get tier-based background color
 */
export const getTierBgColor = (tier: number): string => {
  switch (tier) {
    case 0: return "bg-green-500";
    case 1: return "bg-yellow-500";
    case 2: return "bg-amber-500";
    case 3: return "bg-orange-500";
    default: return "bg-red-500";
  }
};

/**
 * Get tier-based glow color for text
 */
export const getTierTextGlow = (tier: number): string => {
  switch (tier) {
    case 0: return "rgba(74, 222, 128, 0.8)";
    case 1: return "rgba(250, 204, 21, 0.8)";
    case 2: return "rgba(251, 146, 60, 0.8)";
    case 3: return "rgba(249, 115, 22, 0.8)";
    default: return "rgba(248, 113, 113, 0.8)";
  }
};

/**
 * Get next tier-based text color
 */
export const getNextTierTextColor = (nextTier: number): string => {
  switch (nextTier) {
    case 0: return "text-green-400";
    case 1: return "text-yellow-400";
    case 2: return "text-amber-400";
    case 3: return "text-orange-400";
    default: return "text-red-400";
  }
}; 