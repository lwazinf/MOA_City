import React, { useEffect, useState } from 'react';

interface PaymentConfirmationProps {
  getPaymentTime: () => string;
}

/**
 * Displays a confirmation message after successful payment
 */
const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ getPaymentTime }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Trigger animation after component mount
  useEffect(() => {
    // Small delay to ensure animation plays after component is visible
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-center py-2">
      <div 
        className="flex flex-col items-center w-full"
      >
        <div 
          className={`
            text-green-400 text-sm font-medium tracking-wide mb-2
            transition-all duration-500 ease-out
            ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}
          `}
          style={{ transitionDelay: '100ms' }}
          aria-live="polite"
          role="status"
        >
          Payment Complete
        </div>
        
        <div 
          className={`
            text-white text-xs opacity-80 mb-3
            transition-all duration-500 ease-out
            ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}
          `}
          style={{ transitionDelay: '200ms' }}
        >
          Thank you for your payment
        </div>

        {/* Success checkmark with animation */}
        <div 
          className={`
            w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3
            transition-all duration-700 ease-out
            ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
          style={{ transitionDelay: '300ms' }}
          aria-hidden="true"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`
              h-6 w-6 text-green-400
              transition-all duration-500 ease-out
              ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
            `}
            style={{ transitionDelay: '500ms' }}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        
        <div 
          className={`
            text-gray-400 text-xs
            transition-all duration-500 ease-out
            ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-2'}
          `}
          style={{ transitionDelay: '600ms' }}
        >
          {getPaymentTime()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaymentConfirmation); 