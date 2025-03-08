// Price tiers configuration
export const priceTiers = [
  { maxMinutes: 180, price: "R10" },  // 0-3 hours (0-180 minutes)
  { maxMinutes: 360, price: "R20" },  // 3-6 hours (180-360 minutes)
  { maxMinutes: 420, price: "R30" },  // 6-7 hours (360-420 minutes)
  { maxMinutes: 480, price: "R50" },  // 7-8 hours (420-480 minutes)
  { maxMinutes: 1440, price: "R80" }, // 8-24 hours (480-1440 minutes)
];

// Types
export interface PriceTier {
  maxMinutes: number;
  price: string;
}

export interface TierInfo {
  tier: number;
  price: string;
  startMinute: number;
  endMinute: number;
}

export interface TimeUntilChange {
  hours: number;
  minutes: number;
  totalMinutes: number;
  percentage: number;
} 