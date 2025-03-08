import React from 'react';

function Particles() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() * 2 + 1;
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Use different colors for particles to match the pastel color scheme
        const colorClasses = [
          "bg-purple-300/20",
          "bg-pink-300/15",
          "bg-indigo-300/20",
          "bg-blue-300/15"
        ];
        
        const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
        
        return (
          <div 
            key={i}
            className={`absolute rounded-full ${colorClass}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left,
              top,
              opacity: 0.4,
              animation: `float ${duration}s infinite linear ${delay}s`,
              transform: 'translateY(0px)'
            }}
          />
        );
      })}
    </div>
  );
}

export default Particles; 