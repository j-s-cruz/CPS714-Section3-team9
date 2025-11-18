import StripeProvider from '@/context/StripeProvider';
import SubscriptionSummary from '@/components/billing/SubscriptionSummary';
import BillingHistoryTable from '@/components/billing/BillingHistoryTable';
// import { apiClient } from '@/lib/apiClient'; // Not yet fully implemented, so we'll simulate data fetch for now.

// Define the data types expected from your API
interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
}

interface SubscriptionStatus {
  currentPlan: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  totalPaidYTD: number;
  paymentMethod: string;
  last4: string;
}

// SIMULATE DATA FETCH (This will be replaced by apiClient calls later)
const mockSubscriptionStatus: SubscriptionStatus = {
  currentPlan: 'Premium Plan',
  nextPaymentDate: 'Dec 10, 2025',
  nextPaymentAmount: 49.99,
  totalPaidYTD: 549.89,
  paymentMethod: 'Visa',
  last4: '4242',
};

const mockBillingHistory: Invoice[] = [
  { id: 'INV-2025-011', date: 'Nov 10, 2025', description: 'Premium Plan - Monthly', amount: 49.99, status: 'Paid' },
  { id: 'INV-2025-010', date: 'Oct 10, 2025', description: 'Premium Plan - Monthly', amount: 49.99, status: 'Paid' },
  { id: 'INV-2025-009', date: 'Sep 10, 2025', description: 'Premium Plan - Monthly', amount: 49.99, status: 'Paid' },
  // ... more invoices
];


export default async function BillingPage() {
  // 1. **Data Fetching:** (In a real app, you'd use apiClient.getSubscriptionStatus and apiClient.getBillingHistory)
  // We simulate the data for now since the API routes are not implemented yet.
  const statusData = mockSubscriptionStatus;
  const historyData = mockBillingHistory;
  
  // NOTE: In a real Next.js application, you'd fetch the User ID from the session here.
  const userId = 'member_12345'; 

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">💳 Payment & Billing</h1>
      
      {/* 2. Stripe Context Wrapper */}
      {/* The StripeProvider is essential for the PaymentForm to work securely */}
      <StripeProvider>
        <section className="space-y-6">
          
          {/* A. Subscription Summary Section */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Current Subscription</h2>
            <SubscriptionSummary 
              status={statusData}
              userId={userId}
            />
          </div>

          {/* B. One-Time Payment Form (Rendered inside SubscriptionSummary for simplicity, 
             or as a separate component like PaymentForm.tsx) 
          */}
        </section>
      </StripeProvider>

      <hr className="my-10 border-gray-200" />

      {/* 3. Billing History Section */}
      <section className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Billing History</h2>
        <BillingHistoryTable 
          invoices={historyData}
        />
      </section>

    </main>
  );
}