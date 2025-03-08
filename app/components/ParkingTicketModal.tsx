import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faParking, faQuestionCircle, faClock, faCalendarDay, faCreditCard, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import CircularProgress from './CircularProgress';
import ScanTicketButton from './ScanTicketButton';

interface ParkingTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: number;
  maxMinutes: number;
  billAmount: string;
  validUntil: string;
  mallCloses: string;
  userCredits: number;
  onPay: () => void;
}

function ParkingTicketModal({
  isOpen,
  onClose,
  minutes,
  maxMinutes,
  billAmount,
  validUntil,
  mallCloses,
  userCredits,
  onPay
}: ParkingTicketModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Add focus trap for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        } else if (e.key === 'Escape') {
          onClose();
        }
      };

      // Focus first element when modal opens
      firstElement.focus();
      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen, onClose]);
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 350 
      } 
    },
    exit: { 
      scale: 0.95, 
      opacity: 0, 
      y: 10, 
      transition: { 
        duration: 0.2 
      } 
    }
  };
  
  const infoCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.2 + (custom * 0.1),
        type: "spring",
        damping: 25,
        stiffness: 200
      } 
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop with blur effect */}
          <motion.div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          
          {/* Modal container */}
          <motion.div 
            ref={modalRef} 
            className="relative z-10 max-h-[90vh] w-full max-w-md overflow-auto bg-white/95 backdrop-blur-lg rounded-xl border border-gray-200 shadow-lg" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Ambient background effects */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-1">
                <div className="h-full w-full bg-gradient-to-r from-purple-300/0 via-purple-400/30 to-purple-300/0"></div>
              </div>
              <motion.div 
                className="absolute w-96 h-96 -top-24 -right-24 rounded-full bg-pink-100/30 blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute w-96 h-96 -bottom-24 -left-24 rounded-full bg-purple-100/40 blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 10,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Close button */}
            <motion.button 
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100/60 hover:bg-gray-200/60 z-20
                        focus:outline-none focus:ring-2 focus:ring-purple-300/30"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </motion.button>
            
            {/* Modal content - Parking ticket UI */}
            <div className="flex flex-col items-center gap-6 relative p-6 pt-8">
              {/* Header */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-300 mr-1"></div>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FontAwesomeIcon icon={faParking} className="text-purple-500" />
                  </motion.div>
                  <h1 id="modal-title" className="text-xl text-gray-800 font-light tracking-wider font-roboto-condensed">Parking Ticket</h1>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-300 ml-1"></div>
                </div>
                <motion.p 
                  className="text-xs text-gray-500 font-light mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  View your remaining time
                </motion.p>
              </motion.div>
              
              {/* User credits display */}
              <motion.div
                className="bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm border border-purple-100"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FontAwesomeIcon icon={faCreditCard} className="text-purple-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-light">Available Credits</span>
                  <span className="text-purple-700 font-medium">{userCredits} credits</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
              >
                <CircularProgress 
                  minutes={minutes} 
                  text="Time Remaining"
                  maxMinutes={maxMinutes}
                  billAmount={billAmount} 
                />
              </motion.div>
              
              <div className="flex flex-col items-center gap-3 w-full">
                {/* Pay Button */}
                <motion.button
                  onClick={onPay}
                  className="group relative w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2
                           text-white font-normal font-roboto-condensed tracking-wide text-sm
                           overflow-hidden focus:outline-none focus:ring-2 focus:ring-pink-300/50 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={userCredits < 25}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg"></div>
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-white/90 text-sm relative z-10" />
                  <span className="relative z-10">Pay 25 Credits (Reduces time by 25 minutes)</span>
                </motion.button>
                
                <ScanTicketButton />
                
                {/* Additional action button */}
                <motion.button 
                  className="text-xs text-gray-500 hover:text-purple-600 transition-all mt-2 flex items-center gap-1.5 group"
                  whileHover={{ x: 2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} className="text-xs text-purple-500/80" />
                  </motion.div>
                  <span className="relative overflow-hidden">
                    <span className="inline-block">Need help with your ticket?</span>
                    <motion.span 
                      className="absolute bottom-0 left-0 h-px bg-purple-400/60"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    ></motion.span>
                  </span>
                </motion.button>
              </div>
              
              {/* Contextual information with icons for better understanding */}
              <motion.div 
                className="border border-gray-100 rounded-lg bg-gray-50/80 backdrop-blur-sm p-4 w-full hover:border-gray-200 transition-all duration-300 shadow-sm group"
                variants={infoCardVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                {/* Card decoration */}
                <div className="absolute top-0 left-0 h-full w-1 overflow-hidden -ml-[1px] rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-full w-full bg-gradient-to-b from-purple-400/0 via-purple-400/30 to-purple-400/0"></div>
                </div>
                
                <motion.div 
                  className="flex gap-3 items-center mb-3"
                  variants={infoCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <motion.div 
                    className="flex justify-center items-center w-8 h-8 bg-purple-100/80 rounded-full transition-all duration-300 group-hover:bg-purple-100"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    <FontAwesomeIcon 
                      icon={faClock} 
                      className="text-purple-600 w-[14px] h-[14px] transition-all duration-300" 
                    />
                  </motion.div>
                  <div className="flex justify-between w-full items-center">
                    <span className="text-sm text-gray-600 font-light">Valid until</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-800 font-normal tracking-wide bg-white px-2 py-0.5 rounded border border-gray-100">{validUntil}</span>
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex gap-3 items-center"
                  variants={infoCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <motion.div 
                    className="flex justify-center items-center w-8 h-8 bg-purple-100/80 rounded-full transition-all duration-300 group-hover:bg-purple-100"
                    whileHover={{ scale: 1.1, rotate: -15 }}
                  >
                    <FontAwesomeIcon 
                      icon={faCalendarDay} 
                      className="text-purple-600 w-[14px] h-[14px] transition-all duration-300" 
                    />
                  </motion.div>
                  <div className="flex justify-between w-full items-center">
                    <span className="text-sm text-gray-600 font-light">Mall closes at</span>
                    <span className="text-sm text-gray-800 font-normal tracking-wide bg-white px-2 py-0.5 rounded border border-gray-100">{mallCloses}</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ParkingTicketModal; 