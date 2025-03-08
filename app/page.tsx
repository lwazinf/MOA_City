'use client';

import React, { useState, useEffect } from "react";

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Track time in minutes (0-1440 for 24 hours)
  const [currentMinute, setCurrentMinute] = useState(0);
  
  // Used for the animation frame
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Define price tiers in minutes
  const priceTiers = [
    { maxMinutes: 180, price: "R10" },  // 0-3 hours (0-180 minutes)
    { maxMinutes: 360, price: "R20" },  // 3-6 hours (180-360 minutes)
    { maxMinutes: 420, price: "R30" },  // 6-7 hours (360-420 minutes)
    { maxMinutes: 480, price: "R50" },  // 7-8 hours (420-480 minutes)
    { maxMinutes: 1440, price: "R80" }, // 8-24 hours (480-1440 minutes)
  ];
  
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle pay now button
  const handlePayNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the expanded state
    alert("Processing payment for " + currentTier.price);
    // In a real app, this would open a payment flow
  };
  
  // Get current tier and price
  const getCurrentTier = () => {
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
  
  const currentTier = getCurrentTier();
  
  // Get next tier information
  const getNextTierInfo = () => {
    if (currentTier.tier >= priceTiers.length - 1) {
      return null; // No next tier
    }
    
    return {
      price: priceTiers[currentTier.tier + 1].price,
      startMinute: currentTier.endMinute
    };
  };
  
  const nextTier = getNextTierInfo();
  
  // Calculate time until next tier change
  const getTimeUntilChange = () => {
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
  
  // Get detailed time until next tier change
  const getDetailedTimeUntilChange = () => {
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
  
  const timeUntilChange = getDetailedTimeUntilChange();
  
  // Get tier-based text color
  const getTierTextColor = () => {
    switch (currentTier.tier) {
      case 0: return "text-green-400";
      case 1: return "text-yellow-400";
      case 2: return "text-amber-400";
      case 3: return "text-orange-400";
      default: return "text-red-400";
    }
  };

  // Get tier-based bg color
  const getTierBgColor = () => {
    switch (currentTier.tier) {
      case 0: return "bg-green-500";
      case 1: return "bg-yellow-500";
      case 2: return "bg-amber-500";
      case 3: return "bg-orange-500";
      default: return "bg-red-500";
    }
  };
  
  // Get tier-based glow color for text
  const getTierTextGlow = () => {
    switch (currentTier.tier) {
      case 0: return "rgba(74, 222, 128, 0.8)";
      case 1: return "rgba(250, 204, 21, 0.8)";
      case 2: return "rgba(251, 146, 60, 0.8)";
      case 3: return "rgba(249, 115, 22, 0.8)";
      default: return "rgba(248, 113, 113, 0.8)";
    }
  };
  
  // Get next tier-based text color
  const getNextTierTextColor = () => {
    if (!nextTier) return "";
    
    switch (currentTier.tier + 1) {
      case 0: return "text-green-400";
      case 1: return "text-yellow-400";
      case 2: return "text-amber-400";
      case 3: return "text-orange-400";
      default: return "text-red-400";
    }
  };
  
  // Animate the minutes and indicator lights
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 20);
      
      // Update minute every animation frame (accelerated for demo)
      if (animationFrame % 2 === 0) {
        setCurrentMinute(prevMinute => {
          const nextMinute = prevMinute + 1;
          return nextMinute >= 1440 ? 0 : nextMinute; // Reset after 24 hours
        });
      }
    }, 100); // Faster for demonstration
    
    return () => clearInterval(interval);
  }, [animationFrame]);
  
  // Calculate how many indicator dots should be lit based on progression within current tier
  const calculateActiveDots = () => {
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
  
  const activeDots = calculateActiveDots();
  
  // Format current time for display
  const formatTime = () => {
    const hours = Math.floor(currentMinute / 60);
    const minutes = currentMinute % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="relative min-h-screen bg-zinc-900 overflow-hidden">
      {/* Main content (blank but dark) */}
      <div className="flex items-center justify-center min-h-screen">
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black opacity-80"></div>
        
        {/* Optional subtle grain texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-30"></div>
      </div>
      
      {/* Current time display (for demonstration) */}
      <div className="fixed top-4 left-4 text-gray-500 text-sm">
        Current time: {formatTime()} - Tier: {currentTier.tier + 1}
        </div>
        
      {/* Ticket Timer Widget */}
      <div 
        className="fixed bottom-4 right-4 z-50 scale-[0.9]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          className={`
            relative 
            w-40
            cursor-pointer
            bg-gradient-to-b from-zinc-800 to-zinc-900
            rounded-2xl 
            shadow-xl
            overflow-hidden
            transition-all duration-300 ease-in-out
            ${isHovering ? 'scale-105' : 'scale-100'}
            ${isExpanded ? currentTier.tier == 4 ? 'h-[230px]' : 'h-[290px]' : 'h-[120px]'}
          `}
          onClick={toggleExpand}
        >
          {/* Subtle metallic texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[length:10px_10px] opacity-10"></div>
          
          {/* Gloss effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/3 opacity-30"></div>
          
          {/* Curved edge detail */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-zinc-950 rounded-full opacity-30"></div>
          
          {/* Main display area - always visible section */}
          <div className="absolute inset-5 flex flex-col justify-between h-[90px]">
            {/* Digital readout - displays the appropriate price based on hours with matching tier color */}
            <div className="flex flex-col items-end mt-2 mr-2">
              <div 
                className={`${getTierTextColor()} font-mono text-2xl font-bold tracking-wider transition-all duration-300 ${currentTier.price.length > 3 ? 'text-xl' : ''}`}
                style={{ textShadow: `0 0 8px ${getTierTextGlow()}` }}
              >
                {currentTier.price}
              </div>
              
              {/* Time until next change indicator */}
              {currentTier.tier < 4 && (
                <div className="text-gray-400 text-xs mt-0.5 font-mono opacity-70">
                  {getTimeUntilChange()}
                </div>
              )}
            </div>
            
            {/* Progress indicator lights */}
            <div className="flex justify-center space-x-1 mb-6">
              {Array.from({ length: 10 }).map((_, i) => {
                // Determine if light should be active based on current tier progression
                const isActive = i <= activeDots;
                
                // Check if this is the leading dot (last active dot)
                const isLeadingDot = Math.abs(i - activeDots) < 0.5;
                
                // Get price tier color based on current tier
                const getPriceColor = () => {
                  switch (currentTier.tier) {
                    case 0: return "bg-green-400"; // R10
                    case 1: return "bg-yellow-400"; // R20
                    case 2: return "bg-amber-400"; // R30
                    case 3: return "bg-orange-400"; // R50
                    default: return "bg-red-400"; // R80
                  }
                };
                
                // Get glow color based on current tier
  const getGlowColor = () => {
                  switch (currentTier.tier) {
                    case 0: return "rgba(74, 222, 128, 0.8)"; // R10
                    case 1: return "rgba(250, 204, 21, 0.8)"; // R20
                    case 2: return "rgba(251, 146, 60, 0.8)"; // R30
                    case 3: return "rgba(249, 115, 22, 0.8)"; // R50
                    default: return "rgba(248, 113, 113, 0.8)"; // R80
                  }
                };
                
                const activeColor = getPriceColor();
                const glowColor = getGlowColor();
            
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
            />
          );
        })}
              </div>
              </div>
              
          {/* Expanded section - detailed info about next price change */}
          <div 
            className={`
              absolute top-[100px] inset-x-0 h-[130px] px-4 pt-1
              bg-gradient-to-b from-zinc-900 to-zinc-950
              border-t border-zinc-800/30
              transition-all duration-300 ease-in-out
              ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
          >
            {timeUntilChange && nextTier && (
              <div className="flex flex-col h-full pb-10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-xs">Next Rate:</span>
                  <span className={`${getNextTierTextColor()} text-sm font-medium`}>
                    {nextTier.price}
                  </span>
                </div>
                
                <div className="text-gray-400 text-xs mb-2">
                  Time until rate change:
                </div>
                
                {/* Progress bar for time remaining */}
                <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden mb-3 relative">
                  <div 
                    className={`h-full rounded-full ${getTierTextColor()} opacity-30`}
                    style={{ width: `${timeUntilChange.percentage}%` }}
                  ></div>
                  
                  {/* Animated pulse at the edge of progress */}
                  <div 
                    className={`absolute top-0 h-full w-1 ${getTierTextColor()} opacity-50 animate-pulse-slow`}
                    style={{ left: `${timeUntilChange.percentage}%`, transform: 'translateX(-50%)' }}
                  ></div>
                </div>
                
                {/* Detailed countdown display */}
                <div className="flex justify-center items-center mb-4">
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
                <button
                  onClick={handlePayNow}
                  className={`
                    w-full py-2 rounded-lg font-medium text-sm text-white
                    ${getTierBgColor()}
                    transition-all duration-300 
                    hover:brightness-110 active:brightness-90
                    flex items-center justify-center gap-1
                    shadow-md
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Pay Now
                </button>
              </div>
            )}
            
            {(!timeUntilChange || !nextTier) && (
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
                <button
                  onClick={handlePayNow}
                  className={`
                    w-full py-2 rounded-lg font-medium text-sm text-white
                    ${getTierBgColor()}
                    transition-all duration-300 
                    hover:brightness-110 active:brightness-90
                    flex items-center justify-center gap-1
                    shadow-md
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Pay Now
                </button>
                </div>
              )}
            </div>
            
          {/* Side texture/grip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-2">
            <div className="h-full w-full flex flex-col space-y-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className="h-0.5 w-full bg-zinc-950/50"
                ></div>
              ))}
            </div>
          </div>
          
          {/* Dynamic ambient glow based on price tier */}
          <div className={`
            absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl transition-colors duration-1000
            ${currentTier.tier === 0 ? 'bg-green-500/20' : 
              currentTier.tier === 1 ? 'bg-yellow-500/20' : 
              currentTier.tier === 2 ? 'bg-amber-500/20' : 
              currentTier.tier === 3 ? 'bg-orange-500/20' : 
              'bg-red-500/20'}
          `}></div>
          
          {/* Expand/collapse indicator */}
          <div className={`
            absolute bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-2
            transition-all duration-300 opacity-50 
            ${isExpanded ? 'rotate-180' : 'rotate-0'}
          `}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 10" 
              fill="white"
              className="opacity-40"
            >
              <path d="M0 0 L10 10 L20 0 Z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Add global styles for the glow effect */}
      <style jsx global>{`
        body {
          background-color: rgb(24, 24, 27);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
