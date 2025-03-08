'use client';

import TicketTimer from "@/components/TicketTimer";

export default function Home() {
  // Format current time for display
  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
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
        Current time: {formatTime()}
      </div>
      
      {/* Ticket Timer Widget */}
      <TicketTimer />
      
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
