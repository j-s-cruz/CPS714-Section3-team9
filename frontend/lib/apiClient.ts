// Define the expected structure for a payment request
interface PaymentRequestData {
  userId: string;
  paymentMethodId: string; // Secure tokenized payment method from Stripe client
  amount: number;          // Amount in cents
}

export const apiClient = {
  // Function to fetch the member's subscription status
  getSubscriptionStatus: async (userId: string) => {
    const res = await fetch(`/api/payments/subscription-status?userId=${userId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch subscription status');
    }
    return res.json();
  },

  // Function to get the billing history
  getBillingHistory: async (userId: string) => {
    const res = await fetch(`/api/billing/history?userId=${userId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch billing history');
    }
    return res.json();
  },

  // ✨ NEW FUNCTION: Process a one-time payment
  processOneTimePayment: async (data: PaymentRequestData) => {
    const res = await fetch('/api/payments/process-one-time-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check for network or server-side error status
    if (!res.ok) {
      const errorDetail = await res.json().catch(() => ({ error: 'Unknown API error' }));
      throw new Error(errorDetail.error || 'Failed to process payment');
    }

    return res.json(); // Should return { success: true, message: '...' }
  },

  // Placeholder for updateSubscription
  updateSubscription: async (data: any) => {
    // Implementation to call /api/payments/update-subscription
  },
};