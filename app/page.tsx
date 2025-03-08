'use client';

import React, { useEffect, useState, useRef } from "react";
import { atom, useAtom } from 'jotai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faCalendarDay, 
  faTicket, 
  faQuestionCircle,
  faParking,
  faReceipt,
  faTimes,
  faCar,
  faArrowRight,
  faQrcode,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';

// Jotai atoms for state management
const minutesAtom = atom(25);
const maxMinutesAtom = atom(60);
const billAmountAtom = atom("R10");
const validUntilAtom = atom("14:30");
const mallClosesAtom = atom("18:00");
const isModalOpenAtom = atom(false);
const hasSeenIntroAtom = atom(false);

export default function Home() {
  // Use Jotai for state management
  const [minutes] = useAtom(minutesAtom);
  const [maxMinutes] = useAtom(maxMinutesAtom);
  const [billAmount] = useAtom(billAmountAtom);
  const [validUntil] = useAtom(validUntilAtom);
  const [mallCloses] = useAtom(mallClosesAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [hasSeenIntro, setHasSeenIntro] = useAtom(hasSeenIntroAtom);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Initialize gradient positions
  const gradientRef = useRef<HTMLDivElement>(null);
  
  // Track mouse movement for interactive background effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (gradientRef.current) {
      const rect = gradientRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };
  
  // Add Roboto font family to the entire application
  useEffect(() => {
    document.body.classList.add('font-roboto');
    
    // Simulating first visit intro animation
    if (!hasSeenIntro) {
      setTimeout(() => setHasSeenIntro(true), 1500);
      document.body.classList.add('overflow-hidden');
      return () => document.body.classList.remove('overflow-hidden');
    }
    
    // Handle keyboard events (Esc key to close modal)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, setIsModalOpen, hasSeenIntro, setHasSeenIntro]);

  return (
    <div 
      ref={gradientRef}
      onMouseMove={handleMouseMove} 
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black relative"
    >
      {/* Interactive background */}
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgb(4, 120, 87, 0.15), transparent 45%), 
                       radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgb(5, 150, 105, 0.1), transparent 40%),
                       linear-gradient(to bottom, #090909, #111111)`
        }}
      />
      
      {/* Animated decorative elements */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-900/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-800/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-2/3 w-40 h-40 bg-emerald-900/5 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Particle effect */}
        <Particles />
      </div>
      
      {/* Intro splash screen */}
      {!hasSeenIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeOut">
          <div className="flex items-center gap-3 animate-scaleIntro">
            <FontAwesomeIcon icon={faParking} className="text-emerald-300 text-6xl animate-pulse" />
            <span className="text-5xl text-white font-light">ParkSmart</span>
          </div>
        </div>
      )}
      
      {/* Main page content */}
      <div className={`mb-12 text-center relative z-10 transition-all duration-1000 ${hasSeenIntro ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        <div className="mb-3 flex items-center justify-center">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-500/30 mr-4"></div>
          <span className="text-emerald-400/80 text-sm uppercase tracking-widest font-light">Digital Ticket System</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-500/30 ml-4"></div>
        </div>
        
        <h1 className="text-5xl font-light text-white mb-6 font-roboto-condensed flex items-center justify-center gap-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">
            Mall Parking
          </span>
        </h1>
        <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
          View and manage your parking details with our digital ticket system. 
          Monitor your remaining time and extend your stay easily.
        </p>
      </div>
      
      {/* Button to open modal - with hover effects */}
      <button
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`group relative px-8 py-4 rounded-xl 
                  flex items-center gap-3 transition-all duration-500
                  font-roboto-condensed tracking-wide overflow-hidden
                  ${hasSeenIntro ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
      >
        {/* Button background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-emerald-800/30 to-emerald-900/40 backdrop-blur-md border border-emerald-500/20 rounded-xl transition-all duration-500 group-hover:bg-emerald-800/30"></div>
        
        {/* Button shine effect */}
        <div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1200 rounded-xl overflow-hidden`}
        >
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1500 ease-in-out"></div>
        </div>
        
        {/* Button content */}
        <FontAwesomeIcon icon={faCar} className="text-emerald-300 z-10 text-lg" />
        <span className="text-white z-10">View Parking Ticket</span>
        <FontAwesomeIcon 
          icon={faArrowRight} 
          className="text-emerald-300/60 text-sm ml-2 z-10 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" 
        />
      </button>
      
      {/* Magnetic effect hover indicators */}
      {isHovering && (
        <div className="absolute w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-fast"></div>
        </div>
      )}
      
      {/* Modal */}
      <ParkingTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        minutes={minutes}
        maxMinutes={maxMinutes}
        billAmount={billAmount}
        validUntil={validUntil}
        mallCloses={mallCloses}
      />
    </div>
  );
}

// Particle animation component
function Particles() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 2 + 1;
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        return (
          <div 
            key={i}
            className="absolute rounded-full bg-emerald-400/10"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left,
              top,
              opacity: 0.2,
              animation: `float ${duration}s infinite linear ${delay}s`,
              transform: 'translateY(0px)'
            }}
          />
        );
      })}
    </div>
  );
}

interface ParkingTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: number;
  maxMinutes: number;
  billAmount: string;
  validUntil: string;
  mallCloses: string;
}

function ParkingTicketModal({
  isOpen,
  onClose,
  minutes,
  maxMinutes,
  billAmount,
  validUntil,
  mallCloses
}: ParkingTicketModalProps) {
  const [closing, setClosing] = useState(false);
  
  // Handle closing animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md ${closing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={handleClose} 
      />
      
      {/* Modal container */}
      <div className={`relative z-10 max-h-[90vh] overflow-auto bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800/30 shadow-xl shadow-emerald-900/5 ${closing ? 'animate-scaleOut' : 'animate-scaleIn'}`}>
        {/* Modal decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-emerald-900/0 via-emerald-500/30 to-emerald-900/0"></div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 z-20
                    hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>
        
        {/* Modal content - Parking ticket UI */}
        <div className="flex flex-col items-center gap-10 relative p-7 sm:p-10">
          {/* Ambient glow effect behind the component */}
          <div className="absolute w-96 h-96 rounded-full bg-emerald-700/5 blur-3xl -z-10 animate-pulse-slow"></div>
          
          {/* Header */}
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-500/30"></div>
              <FontAwesomeIcon icon={faParking} className="text-emerald-300/90" />
              <h1 className="text-xl text-white font-light tracking-wider font-roboto-condensed">Parking Ticket</h1>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-500/30"></div>
            </div>
            <p className="text-xs text-gray-400 font-light mt-1">View your remaining time</p>
          </div>
          
          <CircularProgress 
            minutes={minutes} 
            text="Time Remaining"
            maxMinutes={maxMinutes}
            billAmount={billAmount} 
          />
          
          <div className="flex flex-col items-center gap-3 w-full">
            <ScanTicketButton />
            
            {/* Additional action button */}
            <button className="text-xs text-gray-400 hover:text-emerald-300/80 transition-colors mt-1 flex items-center gap-1.5 hover:gap-2 transition-all duration-300 group">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-xs transition-all duration-300 group-hover:scale-110" />
              <span className="relative overflow-hidden">
                <span className="inline-block">Need help with your ticket?</span>
                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-emerald-300/40 transition-all duration-300"></span>
              </span>
            </button>
          </div>
          
          {/* Contextual information with icons for better understanding */}
          <div className="border border-gray-800/30 rounded-xl bg-black/40 backdrop-blur-sm p-5 w-80 hover:border-gray-700/40 transition-all duration-300 shadow-sm shadow-emerald-900/5 group">
            {/* Card decoration */}
            <div className="absolute top-0 left-0 right-0 h-full w-1 overflow-hidden -ml-[1px] rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-full w-full bg-gradient-to-b from-emerald-900/0 via-emerald-500/20 to-emerald-900/0"></div>
            </div>
            
            <div className="flex gap-3 items-center mb-4">
              <div className="flex justify-center items-center w-8 h-8 bg-emerald-900/20 rounded-full transition-all duration-300 group-hover:bg-emerald-900/30">
                <FontAwesomeIcon 
                  icon={faClock} 
                  className="text-emerald-300/70 w-[14px] h-[14px] transition-all duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="text-sm text-gray-300 font-light">Valid until</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-white font-normal tracking-wide bg-gray-800/40 px-2 py-0.5 rounded">{validUntil}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center w-8 h-8 bg-emerald-900/20 rounded-full transition-all duration-300 group-hover:bg-emerald-900/30">
                <FontAwesomeIcon 
                  icon={faCalendarDay} 
                  className="text-emerald-300/70 w-[14px] h-[14px] transition-all duration-300 group-hover:scale-110" 
                />
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="text-sm text-gray-300 font-light">Mall closes at</span>
                <span className="text-sm text-white font-normal tracking-wide bg-gray-800/40 px-2 py-0.5 rounded">{mallCloses}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanTicketButton() {
  const [isPressing, setIsPressing] = useState(false);
  
  return (
    <button 
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onMouseLeave={() => setIsPressing(false)}
      className="group relative w-full px-8 py-4 rounded-xl flex items-center justify-center gap-3
                text-white font-normal font-roboto-condensed tracking-wider text-sm
                overflow-hidden transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 focus:ring-offset-black"
      style={{
        transform: isPressing ? 'scale(0.98)' : 'scale(1)'
      }}
    >
      {/* Button background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 backdrop-blur-md border border-emerald-500/20 rounded-xl transition-all duration-500 group-hover:bg-emerald-800/30"></div>
      
      {/* Button pulse effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-emerald-500/5 rounded-xl transform scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
      </div>
      
      {/* Button shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden rounded-xl">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000 ease-in-out"></div>
      </div>
      
      {/* Icon container with pulse animation */}
      <div className="relative z-10 mr-1">
        <FontAwesomeIcon 
          icon={faQrcode} 
          className="text-emerald-300 text-lg transition-all duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full transform scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm"></div>
      </div>
      
      <span className="relative z-10">Scan to Extend Time</span>
      
      {/* Animated indicator */}
      <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-400/80 ml-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
    </button>
  );
}

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
  
  // Helper function to determine color class based on time remaining
  const getTimeColorClass = () => {
    if (minutes <= 10) return "text-red-400"; // Critical time remaining
    if (minutes <= 20) return "text-amber-300"; // Low time remaining
    return "text-white"; // Good amount of time remaining
  };

  // Helper function to determine glow color based on time remaining
  const getGlowColor = () => {
    if (minutes <= 10) return "rgba(248, 113, 113, OPACITY)"; // Red glow
    if (minutes <= 20) return "rgba(252, 211, 77, OPACITY)"; // Amber glow
    return "rgba(52, 211, 153, OPACITY)"; // Default emerald glow
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative group cursor-pointer perspective"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Magnetic hover effect */}
      <div className={`absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full transition-opacity duration-500 ${isHovering ? 'opacity-30' : 'opacity-0'}`}></div>
      
      {/* Glass effect plate behind the component */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-md -z-10"></div>
      
      {/* The dots circle */}
      <div className="relative w-72 h-72 transform transition-transform duration-500">
        {/* Label for the outer ring */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-light">
          <span className="opacity-80">{maxMinutes} minutes max parking time</span>
        </div>
        
        {/* Minutes percentage indicator */}
        <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5">
          <div className="h-px w-6 bg-gray-700/50"></div>
          <div className="text-xs text-emerald-300/80 font-light tracking-wider font-mono">
            {Math.round(percentage)}%
          </div>
          <div className="h-px w-6 bg-gray-700/50"></div>
        </div>
      
        {/* Generate dots in a circle */}
        {Array.from({ length: totalDots }).map((_, index) => {
          // Calculate position on the circle
          const angle = (index / totalDots) * 2 * Math.PI;
          const radius = 130; // Radius in pixels
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
            ? `0 0 ${10 + (glowIntensity * 14)}px ${4 + (glowIntensity * 6)}px ${getGlowColor().replace('OPACITY', String(glowIntensity + 0.1))}` 
            : 'none';
          
          // Animations for the edge dot
          const animationClass = index === lastActiveDotIndex 
            ? 'animate-pulse' 
            : '';
          
          // Calculate delay for hover animation - creates a ripple effect on hover
          const animationDelay = `${index * 8}ms`;
            
          return (
            <div
              key={index}
              className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 
                         ${isActive ? (minutes <= 10 ? 'bg-red-400/90' : minutes <= 20 ? 'bg-amber-300/90' : 'bg-emerald-300/90') : 'bg-gray-700/40'}
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
          <div className="flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg rounded-full w-56 h-56 border border-gray-800/30 shadow-lg relative overflow-hidden group-hover:border-gray-700/40 transition-all duration-500">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-transparent opacity-60"></div>
            
            {/* Shine effect on hover */}
            <div className="absolute -inset-full bg-gradient-to-br from-emerald-300/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rotate-12 blur-md transition-opacity duration-1000 pointer-events-none"></div>
            
            {/* Ring notification animation */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/0 group-hover:border-emerald-500/10 scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
            <div className="absolute inset-0 rounded-full border border-emerald-500/0 group-hover:border-emerald-500/5 scale-95 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-1500 delay-200"></div>
            
            <div className="relative z-10">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-light mb-0.5 font-roboto-condensed flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400/70"></span>
                <span>{text}</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400/70"></span>
              </div>
              
              <div className="flex items-baseline mt-1">
                <span className={`text-6xl font-light ${getTimeColorClass()} font-roboto-condensed`}>{minutes}</span>
                <span className="text-base ml-1 text-gray-400 font-light opacity-70">min</span>
              </div>
              
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-3"></div>
              
              {billAmount && (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400 font-light mb-1 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faReceipt} className="text-xs text-emerald-300/70" />
                    <span className="tracking-wide">Current charge</span>
                  </span>
                  <div className="relative py-1.5 px-7 rounded-full overflow-hidden">
                    {/* Button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-emerald-700/10 rounded-full border border-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-500"></div>
                    
                    {/* Button pulse */}
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-full transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    
                    <span className="relative z-10 text-xl font-light text-emerald-300/90 font-roboto-condensed">{billAmount}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Info button */}
            <button 
              className="absolute bottom-4 right-4 text-gray-500 hover:text-emerald-400 transition-colors duration-300 p-2 rounded-full hover:bg-emerald-900/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              aria-label="More information"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these animations to your tailwind.config.js
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// @keyframes fadeOut {
//   from { opacity: 1; }
//   to { opacity: 0; }
// }
// @keyframes scaleIn {
//   from { transform: scale(0.95); opacity: 0; }
//   to { transform: scale(1); opacity: 1; }
// }
// @keyframes scaleOut {
//   from { transform: scale(1); opacity: 1; }
//   to { transform: scale(0.95); opacity: 0; }
// }
// @keyframes scaleIntro {
//   0% { transform: scale(0.5); opacity: 0; }
//   70% { transform: scale(1.05); opacity: 1; }
//   100% { transform: scale(1); opacity: 1; }
// }
// @keyframes float {
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-15px); }
//   100% { transform: translateY(0px); }
// }
// animation: {
//   fadeIn: 'fadeIn 0.3s ease-out',
//   fadeOut: 'fadeOut 0.3s ease-out',
//   scaleIn: 'scaleIn 0.4s ease-out',
//   scaleOut: 'scaleOut 0.3s ease-out',
//   scaleIntro: 'scaleIntro 1.2s ease-out',
//   'pulse-slow': 'pulse 8s ease-in-out infinite',
//   'pulse-fast': 'pulse 2s ease-in-out infinite',
//   float: 'float 10s ease-in-out infinite',
//   'float-delayed': 'float 12s ease-in-out infinite 2s',
// }
