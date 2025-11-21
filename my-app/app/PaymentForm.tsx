"use client";

import { useState } from 'react';
import { Lock, ChevronDown } from 'lucide-react'; 

interface PaymentMethod {
    id: number;
    card_type: string;
    last_four: string;
    is_default: boolean;
}

interface PaymentFormProps {
    paymentMethods: PaymentMethod[];
    // We will use this later to inform the parent component of a successful payment
    // onPaymentSuccess: () => void;
}

export default function PaymentForm({ paymentMethods }: PaymentFormProps) {
    
    // NOTE: For now, amount is initialized to 0.00
    const [amount, setAmount] = useState<number>(0.00);
    // Select the default method, or 0 if the array is empty
    const [selectedMethod, setSelectedMethod] = useState<number>(
        paymentMethods.find(pm => pm.is_default)?.id || (paymentMethods[0]?.id || 0)
    );

    const handleQuickPay = (quickAmount: number) => {
        setAmount(quickAmount);
    };

    const handleProcessPayment = () => {
        if (amount <= 0 || selectedMethod === 0) {
            alert("Please enter a valid amount and select a payment method.");
            return;
        }
        
        // This is where the secure payment logic (calling a Next.js API Route) will go.
        alert(`Simulating secure payment of ${formatValue(amount)} using method ID ${selectedMethod}. (Next step: implement API call)`);
        console.log(`SECURE PAYLOAD TO API: { amount: ${amount}, method: ${selectedMethod} }`);
        
        // if (onPaymentSuccess) onPaymentSuccess();
    };
    
    // Simple local formatter for the form display
    const formatValue = (value: number) => {
        return `C$${value.toFixed(2)}`;
    }

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
                />
              </div>
            </div>

            {/* Payment Method Dropdown (Currently empty/placeholder) */}
            <div className="mb-6">
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Payment Method</label>
              <div className="relative">
                <select
                  id="payment-method"
                  className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white cursor-pointer"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
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
                <ChevronDown className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-gray-500 dark:text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Process Payment Button */}
            <button 
                onClick={handleProcessPayment}
                className="flex justify-center items-center w-full py-3 mb-2 bg-black dark:bg-indigo-600 text-white font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-indigo-700 transition"
            >
                <Lock className="w-4 h-4 mr-2" />
                Process Payment
            </button>
            
            {/* Security Message */}
            <p className="text-center text-xs text-gray-500 dark:text-zinc-400 mb-6">
              Secure payment processing powered by **Stripe**
            </p>

            {/* Quick Payment Options */}
            <div className="flex justify-between space-x-3">
                {['25.00', '50.00', '100.00'].map(val => (
                    <button 
                        key={val}
                        onClick={() => handleQuickPay(parseFloat(val))}
                        className="flex-1 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-800 dark:text-zinc-200 font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                    >
                        {formatValue(parseFloat(val))}
                    </button>
                ))}
            </div>
        </div>
    );
}