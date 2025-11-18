'use client';

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { apiClient } from '@/lib/apiClient'; // Used to communicate with your Next.js API Route

// --- Types ---
interface PaymentFormProps {
  userId: string;
  currentPaymentMethod: string;
  last4: string;
}

// --- PaymentForm Component ---
export default function PaymentForm({ userId, currentPaymentMethod, last4 }: PaymentFormProps) {
  // 1. Hooks to access Stripe instance and Elements context
  const stripe = useStripe();
  const elements = useElements();

  // State management for user input and processing status
  const [amount, setAmount] = useState<number | ''>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Submission Handler ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!stripe || !elements || !amount || amount <= 0) {
      setErrorMessage("Please enter a valid amount and ensure the payment form is loaded.");
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Client-Side Payment Method Creation (Tokenization)
      // This securely sends the card details to Stripe and returns a Token or PaymentMethod ID.
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
          throw new Error("Card element not found.");
      }

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          // You would typically pull user name/email from props/context
          name: 'FitHub Member', 
        },
      });

      if (error) {
        setErrorMessage(error.message || "An unknown error occurred during tokenization.");
        setIsProcessing(false);
        return;
      }

      // 3. Server-Side Payment Confirmation (Actual Charge)
      // Send the secure PaymentMethod ID and amount to your Next.js API Route.
      const result = await apiClient.processOneTimePayment({
        userId,
        paymentMethodId: paymentMethod.id,
        amount: amount * 100, // Stripe expects amounts in cents
      });

      if (result.success) {
        alert('Payment processed successfully!');
        setAmount('');
        cardElement.clear(); // Clear the secure card element
      } else {
        setErrorMessage(result.error || 'Payment failed. Please try again.');
      }

    } catch (err) {
      console.error(err);
      setErrorMessage("System error during payment processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
            placeholder="0.00"
            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
            min="1"
          />
        </div>
      </div>

      {/* Payment Method Selector (Simulated using the current saved card) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select 
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          defaultValue="saved"
        >
          <option value="saved">
            {currentPaymentMethod} **** {last4}
          </option>
          {/* In a complete app, you'd add options for 'Use New Card' */}
        </select>
      </div>

      {/* Stripe Card Element (The secure input field) */}
      <div className="border border-gray-300 p-3 rounded-md shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements || !amount}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Process Payment'}
      </button>

      <p className="text-center text-xs text-gray-500 mt-2">
        Secure payment processing powered by Stripe.
      </p>
    </form>
  );
}