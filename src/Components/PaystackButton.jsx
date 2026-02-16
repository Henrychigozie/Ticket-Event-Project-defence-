import React, { useEffect } from 'react';

const PaystackButton = ({ 
  email, 
  amount, 
  metadata, 
  onSuccess, 
  onClose, 
  disabled, 
  children, 
  className 
}) => {
  
  // ✅ Load Paystack script
  useEffect(() => {
    if (!document.querySelector('script[src*="paystack.co"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleClick = () => {
    if (disabled) return;
    
    console.log("💰 Processing payment for:", { email, amount });
    
    if (!window.PaystackPop) {
      alert("Payment system loading. Please try again in 1 second.");
      return;
    }

    const paystack = new window.PaystackPop();
    
    paystack.newTransaction({
      key: "pk_test_82c44f3057d7458b006f39e5cb39c15e33fedb3a",
      email: email,
      amount: amount,
      currency: "NGN",
      reference: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      metadata: metadata,
      onSuccess: (transaction) => {
        console.log("%c✅✅✅✅ PAYSTACK SUCCESS! ✅✅✅✅", "font-size: 20px; color: green; background: black;");
        console.log("Transaction:", transaction);
        onSuccess(transaction);
      },
      onCancel: () => {
        console.log("❌ Payment cancelled");
        onClose();
      },
      onError: (error) => {
        console.error("❌ Paystack error:", error);
        alert(`Payment error: ${error.message}`);
        onClose();
      }
    });
  };

  return (
    <button onClick={handleClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
};

export default PaystackButton;