import StripeProvider from '@/context/StripeProvider';
import SubscriptionSummary from '@/components/billing/SubscriptionSummary';
import BillingHistoryTable from '@/components/billing/BillingHistoryTable';

//Types for submission
type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
};

type SubscriptionStatus = {
  currentPlan: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  totalPaidYTD: number;
  paymentMethod: string;
  last4: string;
};

// Fetch subscription status and billing history from the API
async function getBillingData(): Promise<{ status: SubscriptionStatus, history: Invoice[], userId: string }> {
  const userId = 'member_12345'; //placeholder for authenticated user ID
  

  // Placeholder data
  const status: SubscriptionStatus = {
    currentPlan: 'Premium Plan', nextPaymentDate: 'Dec 10, 2025', nextPaymentAmount: 49.99,
    totalPaidYTD: 549.89, paymentMethod: 'Visa', last4: '4242',
  };
  const history: Invoice[] = [
    { id: 'INV-011', date: 'Nov 10, 2025', description: 'Premium Monthly', amount: 49.99, status: 'Paid' },
    { id: 'INV-010', date: 'Oct 10, 2025', description: 'Premium Monthly', amount: 49.99, status: 'Paid' },
  ];

  return { status, history, userId };
}

// --- Main Server Component ---
export default async function BillingPage() {
  const { status, history, userId } = await getBillingData();

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">💳 Payment & Billing</h1>
      
      {/* Stripe Context must wrap any component using useStripe/useElements */}
      <StripeProvider>
        <section className="bg-white shadow-lg rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Account Management</h2>
          <SubscriptionSummary 
            status={status}
            userId={userId}
          />
        </section>
      </StripeProvider>

      {/* Billing History Section */}
      <section className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Billing History</h2>
        <BillingHistoryTable 
          invoices={history}
        />
      </section>

    </main>
  );
}