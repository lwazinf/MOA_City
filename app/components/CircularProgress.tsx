import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  minutes: number;
  text: string;
  maxMinutes?: number;
  billAmount?: string;
}

function CircularProgress({ 
  minutes, 
  text, 
  maxMinutes = 60, 
  billAmount 
}: CircularProgressProps) {
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Calculate the percentage for the circle based on minutes
  const percentage = Math.min(100, (minutes / maxMinutes) * 100);
  
  // Calculate the number of dots to show in the circle
  const totalDots = 80; // Further increased for smoother appearance
  const activeDots = Math.round((percentage / 100) * totalDots);
  
  // Reference for last active dot index (used for glowing edge effect)
  const lastActiveDotIndex = activeDots - 1;
  
  // Calculate remaining time
  const remainingTime = maxMinutes - minutes;
  
  // Helper function to determine color class based on time remaining
  const getTimeColorClass = () => {
    if (minutes <= 10) return "text-red-500"; // Critical time remaining
    if (minutes <= 20) return "text-amber-500"; // Low time remaining
    return "text-purple-700"; // Good amount of time remaining
  };

  // Helper function to determine glow color based on remaining time
  const getGlowColor = () => {
    if (remainingTime <= 5) return "rgba(239, 68, 68, OPACITY)"; // Flash red glow
    if (remainingTime <= 10) return "rgba(239, 68, 68, OPACITY)"; // Red glow
    if (remainingTime <= 20) return "rgba(245, 158, 11, OPACITY)"; // Amber glow
    return "rgba(168, 85, 247, OPACITY)"; // Default purple glow
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative group cursor-pointer perspective"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Magnetic hover effect */}
      <div className={`absolute inset-0 bg-purple-100 blur-3xl rounded-full transition-opacity duration-500 ${isHovering ? 'opacity-60' : 'opacity-0'}`}></div>
      
      {/* Glass effect plate behind the component */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent rounded-full blur-md -z-10"></div>
      
      {/* The dots circle */}
      <motion.div 
        className="relative w-64 h-64 transform transition-transform duration-500"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Label for the outer ring */}
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-light">
          <span className="opacity-90">{maxMinutes} minutes max parking time</span>
        </div>
        
        {/* Minutes percentage indicator */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5">
          <div className="h-px w-6 bg-gray-300"></div>
          <div className="text-xs text-purple-600 font-light tracking-wider font-mono">
            {Math.round(percentage)}%
          </div>
          <div className="h-px w-6 bg-gray-300"></div>
        </div>
      
        {/* Generate dots in a circle */}
        {Array.from({ length: totalDots }).map((_, index) => {
          // Calculate position on the circle
          const angle = (index / totalDots) * 2 * Math.PI;
          const radius = 115; // Radius in pixels
          const x = radius * Math.sin(angle);
          const y = -radius * Math.cos(angle);
          
          // Determine if the dot should be active based on percentage
          const isActive = index < activeDots;
          
          // Only active dots glow, with varying intensities
          let glowIntensity = 0;
          const dotOpacity = isActive ? 0.9 : 0.4;
          let size = "1.5"; // Smaller dots for smoother appearance
          
          if (isActive) {
            // Calculate how close this dot is to the progress edge
            const distanceFromEdge = Math.abs(index - lastActiveDotIndex);
            
            if (distanceFromEdge === 0) {
              // The last active dot (edge dot) gets the strongest glow and pulsing animation
              glowIntensity = 0.7;
              size = "3.5";
            } else if (distanceFromEdge <= 2) {
              // Near the edge - stronger glow
              glowIntensity = 0.6;
              size = "3";
            } else if (distanceFromEdge <= 5) {
              // Medium distance from edge
              glowIntensity = 0.5;
              size = "2.5";
            } else if (distanceFromEdge <= 10) {
              // Farther from edge
              glowIntensity = 0.4;
              size = "2";
            } else if (distanceFromEdge <= 15) {
              // Even farther from edge
              glowIntensity = 0.3;
              size = "1.75";
            } else {
              // Further from edge - dimmer glow
              glowIntensity = 0.2;
            }
          }
          
          // Generate shadow style based on calculated intensity
          const glowStyle = isActive 
            ? `0 0 ${8 + (glowIntensity * 12)}px ${3 + (glowIntensity * 5)}px ${getGlowColor().replace('OPACITY', String(glowIntensity * 0.8))}` 
            : 'none';
          
          // Animations for the edge dot
          const animationClass = index === lastActiveDotIndex && remainingTime <= 5
            ? 'animate-flash' 
            : index === lastActiveDotIndex 
            ? 'animate-pulse' 
            : '';
          
          // Calculate delay for hover animation - creates a ripple effect on hover
          const animationDelay = `${index * 8}ms`;
          
          return (
            <div
              key={index}
              className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 
                         ${isActive ? (minutes <= 10 ? 'bg-red-500' : minutes <= 20 ? 'bg-amber-500' : 'bg-purple-500') : 'bg-gray-300'}
                         transition-all duration-500 ease-in-out ${animationClass}
                         group-hover:scale-110 group-hover:duration-[800ms]`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                boxShadow: glowStyle,
                opacity: dotOpacity,
                transitionDelay: animationDelay
              }}
            />
          );
        })}
        
        {/* Inner circle with minutes and text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-white backdrop-blur-lg rounded-full w-48 h-48 border border-gray-200 shadow-md relative overflow-hidden group-hover:border-gray-300 transition-all duration-500">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent opacity-60"></div>
            
            {/* Shine effect on hover */}
            <div className="absolute -inset-full bg-gradient-to-br from-pink-100 via-transparent to-transparent opacity-0 group-hover:opacity-100 rotate-12 blur-md transition-opacity duration-1000 pointer-events-none"></div>
            
            {/* Ring notification animation */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/0 group-hover:border-purple-500/10 scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
            <div className="absolute inset-0 rounded-full border border-purple-500/0 group-hover:border-purple-500/5 scale-95 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-1500 delay-200"></div>
            
            <div className="relative z-10">
              <div className="text-xs uppercase tracking-widest text-gray-500 font-light mb-0.5 font-roboto-condensed flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-purple-500/70"></span>
                <span>{text}</span>
                <span className="w-1 h-1 rounded-full bg-purple-500/70"></span>
              </div>
              
              <div className="flex items-baseline mt-1">
                <span className={`text-6xl font-light ${getTimeColorClass()} font-roboto-condensed`}>{minutes}</span>
                <span className="text-base ml-1 text-gray-500 font-light opacity-80">min</span>
              </div>
              
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>
              
              {billAmount && (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 font-light mb-1 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faReceipt} className="text-xs text-purple-600/90" />
                    <span className="tracking-wide">Current charge</span>
                  </span>
                  <motion.div 
                    className="relative py-1.5 px-6 rounded-full overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 group-hover:border-purple-300 transition-all duration-500"></div>
                    
                    {/* Button pulse */}
                    <div className="absolute inset-0 bg-purple-500/5 rounded-full transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    
                    <span className="relative z-10 text-xl font-light text-purple-700 font-roboto-condensed">{billAmount}</span>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Info button */}
            <button 
              className="absolute bottom-3 right-3 text-gray-400 hover:text-purple-600 transition-colors duration-300 p-1.5 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-1 focus:ring-purple-300"
              aria-label="More information"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CircularProgress; 