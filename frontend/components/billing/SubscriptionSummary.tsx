'use client';

import React, { useState } from 'react';
import PaymentForm from './PaymentForm';

// --- Types (Simplified for component use) ---
interface SubscriptionSummaryProps {
  status: {
    currentPlan: string;
    nextPaymentDate: string;
    nextPaymentAmount: number;
    totalPaidYTD: number;
    paymentMethod: string;
    last4: string;
  };
  userId: string;
}

// --- SubscriptionSummary Component ---
export default function SubscriptionSummary({ status, userId }: SubscriptionSummaryProps) {
  // State to manage button loading or form visibility (e.g., when upgrading)
  const [isUpgrading, setIsUpgrading] = useState(false);

  // --- Mock/Placeholder Functions ---
  const handleUpgrade = () => {
    // 1. Set loading state: setIsUpgrading(true);
    // 2. Call apiClient.updateSubscription(...) to start the plan upgrade.
    // 3. Handle success/error and reset state.
    console.log(`Starting upgrade flow for user: ${userId}`);
    setIsUpgrading(true);
    alert('Simulating API call for Plan Upgrade...');
    setTimeout(() => {
      setIsUpgrading(false);
      // In a real app, you would redirect to Stripe checkout or update the UI
    }, 1500);
  };

  const handleCancel = () => {
    // 1. Confirm cancellation with the user.
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      // 2. Call apiClient.updateSubscription(...) to cancel the plan.
      console.log(`Canceling subscription for user: ${userId}`);
      alert('Simulating API call for Subscription Cancellation...');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. STATUS CARDS SECTION (Top Row) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusCard title="Current Balance" value="$0.00" subtitle="All payments up to date" />
        <StatusCard title="Next Payment" value={`$${status.nextPaymentAmount.toFixed(2)}`} subtitle={`Due ${status.nextPaymentDate}`} />
        <StatusCard title="Active Subscription" value={status.currentPlan} subtitle="Monthly billing" />
        <StatusCard title="Total Paid (2025)" value={`$${status.totalPaidYTD.toFixed(2)}`} subtitle="11 transactions" />
      </div>

      {/* 2. MAIN SUBSCRIPTION MANAGEMENT (Left/Top Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 flex justify-between items-center">
            Current Subscription <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
          </h3>
          <p className="text-3xl font-bold mb-4">
            {status.currentPlan}
            <span className="text-base text-gray-500"> /month</span>
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Member Since:</strong> Jan 10, 2025</p>
            <p><strong>Next Renewal:</strong> {status.nextPaymentDate}</p>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
            >
              {isUpgrading ? 'Processing...' : '⬆️ Upgrade Plan'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* 3. MAKE A PAYMENT / PAYMENT FORM (Right/Bottom Panel) */}
        <div className="p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-lg font-semibold mb-4">Make a Payment</h3>
          <p className="text-sm text-gray-500 mb-4">Process one-time payments or add credits to your account.</p>
          
          {/* PaymentForm will contain the Stripe Elements */}
          <PaymentForm userId={userId} currentPaymentMethod={status.paymentMethod} last4={status.last4} />
        </div>
      </div>
    </div>
  );
}

// --- Helper Status Card Component (for clean rendering) ---
const StatusCard = ({ title, value, subtitle }: { title: string, value: string, subtitle: string }) => (
  <div className="bg-white p-4 border rounded-lg shadow-sm">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
  </div>
);