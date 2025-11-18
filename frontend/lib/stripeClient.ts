import { loadStripe, Stripe } from '@stripe/stripe-js';

// Get the public key from environment variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null>;


export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePublishableKey) {
    console.error("Stripe Publishable Key is missing. Please check your .env.local file.");
    return Promise.resolve(null);
  }

  // Use a singleton pattern: initialize only once
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }

  return stripePromise;
};