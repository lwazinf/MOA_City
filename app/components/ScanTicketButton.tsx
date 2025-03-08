import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function ScanTicketButton() {
  return (
    <motion.button 
      className="group relative w-full px-8 py-4 rounded-xl flex items-center justify-center gap-3
                text-white font-normal font-roboto-condensed tracking-wider text-sm
                overflow-hidden transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
        delay: 0.1
      }}
    >
      {/* Button background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 border border-emerald-400/20 rounded-xl transition-all duration-500 group-hover:bg-emerald-600"></div>
      
      {/* Button pulse effect */}
      <motion.div 
        className="absolute inset-0 bg-white/10 rounded-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
      
      {/* Button shine effect */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden rounded-xl"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </motion.div>
      
      {/* Icon container with pulse animation */}
      <motion.div 
        className="relative z-10 mr-1"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <FontAwesomeIcon 
          icon={faQrcode} 
          className="text-white text-lg transition-all duration-300" 
        />
        <motion.div 
          className="absolute inset-0 bg-white/20 rounded-full blur-sm"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.div>
      
      <span className="relative z-10">Scan to Extend Time</span>
      
      {/* Animated indicator */}
      <motion.div 
        className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/80 ml-1"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          repeatType: "reverse" 
        }}
      ></motion.div>
    </motion.button>
  );
}

export default ScanTicketButton; 