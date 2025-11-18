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

  // Placeholder for updateSubscription
  updateSubscription: async (data: any) => {
  }
};