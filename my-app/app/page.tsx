"use client";

import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

import { 
    fetchTestValue, 
    fetchSubscriptionData, 
    formatValue, 
    formatDate,
    SubscriptionType
} from '../lib/dataService'; 

import PaymentForm from './PaymentForm';
import SubscriptionPanel from './SubscriptionPanel';
import BillingHistory from './BillingHistory';

export default function PaymentsAndBilling() {

  // Reusing the SubscriptionType definition from above for consistency
  type CurrentSubscriptionType = SubscriptionType;

  const [subscription, setSubscription] = useState<CurrentSubscriptionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [testValue, setTestValue] = useState<string>('Checking Connection...');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const mockUserId = '49f7c14c-1c83-49fc-8701-38043efdb920'; 
  
  useEffect(() => {
    const loadData = async () => {
      if (!mockUserId) { 
        setLoading(false); 
        setTestValue('User ID Missing');
        return; 
      }
      
      try {
        const testResult = await fetchTestValue(mockUserId);
        setTestValue(testResult);
        
        const subData = await fetchSubscriptionData(mockUserId);
        setSubscription(subData);
        
      } catch (err: any) {
        // ACTION: Catch block now specifically logs the full error object 
        console.error("Dashboard Load Error:", err);
        setError("Failed to load dashboard data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mockUserId]);
    
  if (loading) return <div className="flex justify-center w-full min-h-screen items-center text-gray-500">Loading payment and billing data...</div>;
  if (error) return <div className="flex justify-center w-full min-h-screen items-center text-red-500">Error: {error}</div>;

  const currentPlan = subscription || {};

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50 dark:bg-black p-8 sm:p-12 font-sans">
      
      <div className="w-full max-w-6xl">
        
        {/* Title */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment & Billing
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400">
            Manage your payments, subscriptions, and billing history
          </p>
        </header>

        {/* SECTION 1: SUMMARY CARDS (Top Row) */}
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          
          {/*SUPABASE CONNECTION TEST*/}
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
             
          </div>
          {/* Empty Box Placeholders */}
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700"></div>
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700"></div>
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700"></div>

        </section>

        <hr className="my-10 border-gray-200 dark:border-zinc-700" />

        {/* SECTION 2: DETAIL PANELS (Bottom Row) */}
        <section className="w-full flex flex-col md:flex-row gap-6">
          
          {/* LEFT BOX: Current Subscription Panel */}
          <SubscriptionPanel 
            currentPlan={currentPlan}
            formatValue={formatValue}
            formatDate={formatDate}
          />

          {/* RIGHT BOX: Make a Payment Form */}
          <PaymentForm
            paymentMethods={paymentMethods}
          />

        </section>

        {/* Billing History Section */}
        <section className="w-full mt-8">
          <BillingHistory userId={mockUserId} />
        </section>

      </div>
    </div>
  );
}