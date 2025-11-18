'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripeClient';

interface StripeProviderProps {
  children: React.ReactNode;
}

// Load the Stripe Promise outside of the component to ensure it's only created once
const stripePromise = getStripe();


export default function StripeProvider({ children }: StripeProviderProps) {
  // You can add options here if needed, such as clientSecret or appearance options
  const options = {}; 

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}