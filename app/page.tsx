'use client';

import React, { useState, useEffect } from "react";

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  
  // Used for the blinking animation of the indicator lights
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Animate the indicator lights
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 20);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-900 overflow-hidden">
      {/* Main content (blank but dark) */}
      <div className="flex items-center justify-center min-h-screen">
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black opacity-80"></div>
        
        {/* Optional subtle grain texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-30"></div>
      </div>
      
      {/* Ticket Timer Widget */}
      <div 
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={`
          relative 
          w-40 h-32 
          bg-gradient-to-b from-zinc-800 to-zinc-900
          rounded-2xl 
          shadow-xl
          overflow-hidden
          transition-all duration-300
          ${isHovering ? 'scale-105' : 'scale-100'}
        `}>
          {/* Subtle metallic texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[length:10px_10px] opacity-10"></div>
          
          {/* Gloss effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/3 opacity-30"></div>
          
          {/* Curved edge detail */}
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-zinc-950 rounded-full opacity-30"></div>
          
          {/* Main display area */}
          <div className="absolute inset-5 flex flex-col justify-between">
            {/* Digital readout */}
            <div className="flex items-center justify-end mt-3 mr-2">
              <div className="text-amber-500 font-mono text-2xl font-bold tracking-wider glow-text">
                R<span className="text-xl">10</span>
              </div>
            </div>
            
            {/* Progress indicator lights */}
            <div className="flex justify-center space-x-1 mb-3">
              {Array.from({ length: 10 }).map((_, i) => {
                // Determine if light should be active based on animation frame
                const activeDots = Math.floor(animationFrame / 2);
                const isActive = i <= activeDots;
                
                // Check if this is the leading dot (last active dot)
                const isLeadingDot = i === activeDots;
        
        return (
          <div 
            key={i}
                    className={`
                      w-1.5 h-1.5 rounded-full 
                      transition-all duration-300
                      ${isActive 
                        ? isLeadingDot 
                          ? 'bg-amber-400 shadow-[0_0_7px_2px_rgba(245,158,11,0.8)] animate-pulse'
                          : i >= 7
                            ? 'bg-amber-400 shadow-[0_0_5px_1px_rgba(245,158,11,0.7)]'
                            : 'bg-white/70'
                        : 'bg-zinc-700'}
                    `}
          />
        );
      })}
    </div>
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
          
          {/* Orange ambient glow */}
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>
      
      {/* Add global styles for the glow effect */}
      <style jsx global>{`
        .glow-text {
          text-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
        }
        
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
      `}</style>
    </div>
  );
}
