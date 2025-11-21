"use client";

import { useState } from 'react';

interface PaymentMethod {
    id: number;
    card_type: string;
    last_four: string;
    is_default: boolean;
}

interface PaymentFormProps {
    paymentMethods: PaymentMethod[];
    userId: string; // Added user ID prop
    updateBalanceService: (userId: string, amount: number) => Promise<boolean>; // Added service prop
    onPaymentSuccess: () => void; // Added reload prop
}

export default function PaymentForm({ 
    paymentMethods, 
    userId, 
    updateBalanceService, 
    onPaymentSuccess 
}: PaymentFormProps) {
    
    const [amount, setAmount] = useState<number>(0.00);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<number>(
        paymentMethods.find(pm => pm.is_default)?.id || (paymentMethods[0]?.id || 0)
    );

    const handleQuickPay = (quickAmount: number) => {
        setAmount(quickAmount);
    };

    const formatValue = (value: number) => {
        return `C$${value.toFixed(2)}`;
    }

    const handleProcessPayment = async () => {
        if (amount <= 0 || selectedMethod === 0) {
            alert("Please enter an amount greater than zero and select a payment method.");
            return;
        }
        
        // Disable button and show loading state
        setIsProcessing(true);
        
        try {
            // 1. SIMULATE SECURE PAYMENT PROCESSING (This is where a Stripe API call would go)
            console.log(`Simulating secure payment initiation for ${formatValue(amount)}...`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
            
            // 2. UPDATE BALANCE IN SUPABASE (Called after simulated payment success)
            // The service adds the amount paid to the existing balance (credit)
            const success = await updateBalanceService(userId, amount);

            if (success) {
                alert(`Payment successful! ${formatValue(amount)} credited to your account.`);
                setAmount(0.00); // Clear input
                onPaymentSuccess(); // Trigger parent component to reload dashboard data
            } else {
                alert("Payment failed: Could not update user balance in the database.");
            }
        } catch (error) {
            console.error("Payment transaction error:", error);
            alert("An unexpected error occurred during payment processing.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex-1 min-w-[320px] p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
            
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Make a Payment</h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">Process one-time payments or add credits to your account.</p>

            {/* Amount Input */}
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Amount (CAD)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-zinc-400">
                  C$
                </span>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Payment Method Dropdown (Placeholder) */}
            <div className="mb-6">
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Payment Method</label>
              <div className="relative">
                <select
                  id="payment-method"
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white cursor-pointer"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
                  disabled={isProcessing}
                >
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map(pm => (
                      <option key={pm.id} value={pm.id}>
                        {pm.card_type} **** {pm.last_four} {pm.is_default ? '(Default)' : ''}
                      </option>
                    ))
                  ) : (
                    <option value={0} disabled>-- No Saved Methods --</option>
                  )}
                </select>
              </div>
            </div>

            {/* Process Payment Button */}
            <button 
                onClick={handleProcessPayment}
                className="flex justify-center items-center w-full py-3 mb-2 bg-black dark:bg-indigo-600 text-white font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-indigo-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-700"
                disabled={isProcessing}
            >
                {isProcessing ? (
                    'Processing...'
                ) : (
                    <>
                        Process Payment
                    </>
                )}
            </button>
        
        </div>
    );
}