import React from 'react';

interface PaymentConfirmationProps {
  getPaymentTime: () => string;
}

/**
 * Displays a confirmation message after successful payment
 */
const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ getPaymentTime }) => {
  return (
    <div className="flex flex-col h-full justify-center items-center pb-6">
      <div className="bg-green-500/10 rounded-lg p-3 flex flex-col items-center">
        <div 
          className="text-green-400 text-sm font-medium"
          aria-live="polite"
          role="status"
        >
          Payment Complete
        </div>
        <div className="text-white text-xs mt-2 opacity-70">
          Thank you for your payment
        </div>
        <div className="text-gray-400 text-xs mt-3 font-mono">
          {getPaymentTime()}
        </div>

        {/* Success checkmark */}
        <div 
          className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mt-3"
          aria-hidden="true"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-green-400" 
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
      </div>
    </div>
  );
};

export default React.memo(PaymentConfirmation); 