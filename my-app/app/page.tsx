"use client";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

import PaymentForm from './PaymentForm';
import SubscriptionPanel from './SubscriptionPanel'; 

async function fetchTestValue(userId: string) {
    if (!userId) return 'User ID Missing';
    
    // ACTION: Querying the 'memberships' table for the user's tier
    const { data, error } = await supabase
        .from('memberships') 
        .select('tier') 
        .eq('user_id', userId) 
        .maybeSingle(); 

    if (error && error.code !== 'PGRST116') { 
        console.error('Supabase Test Fetch Error:', error);
        return 'FETCH FAILED';
    }
    
    return data ? `Tier Found: ${data.tier || 'No Tier Value'}` : 'TEST: No Membership Found';
}


async function fetchSubscriptionData(userId: string) {
    if (!userId) return null;
    
    // ACTION: Simplified Query - Only fetching fields directly from 'memberships'.
    const { data, error } = await supabase
      .from('memberships') 
      .select(`
        tier, 
        status, 
        current_period_start, 
        current_period_end, 
        created_at
      `)
      .eq('user_id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('Supabase subscription fetch error:', error);
      throw error;
    }
    
    if (data) {
        
        const { tier, status, created_at, current_period_start, current_period_end } = data;

        return {
            // MAPPING: tier (DB) -> plan_name (Component Prop)
            plan_name: tier,
            // Price is temporarily NULL
            price: null, 
            billing_cycle: 'N/A', 
            is_active: status === 'active',
            member_since: created_at || current_period_start,
            next_renewal: current_period_end,
        };
    }

    return null;
}


// Helper functions for formatting
const formatValue = (value: any) => (typeof value === 'number' ? `$${value.toFixed(2)}` : value || 'N/A');
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

export default function PaymentsAndBilling() {

  type SubscriptionType = {
    plan_name: string | null;
    price: number | null;
    billing_cycle: string;
    is_active: boolean;
    member_since: string | null;
    next_renewal: string | null;
  };

  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0.00);
  
  // NEW STATE FOR TEST
  const [testValue, setTestValue] = useState<string>('Checking Connection...');

  // I used my UserID
  const mockUserId = '49f7c14c-1c83-49fc-8701-38043efdb920'; 
  
  // Combined data fetching hook
  useEffect(() => {
    const loadData = async () => {
      if (!mockUserId) { setLoading(false); return; }
      
      try {
       
        const testResult = await fetchTestValue(mockUserId);
        setTestValue(testResult ?? 'TEST: No Profile Found');

        const subData = await fetchSubscriptionData(mockUserId);
        setSubscription(subData);
        
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mockUserId]);
    
  const currentPlan = subscription || {};


  return (
    // Main container to center content on the page
    <div className="flex justify-center w-full min-h-screen bg-gray-50 dark:bg-black p-8 sm:p-12">
      
      {/* Content Area*/}
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

        {/* Summary Cards Section */}
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {/*  Box 1 */}
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
             <p className="text-base font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                 Membership Tier Test
             </p>
             <p className={`text-sm font-medium ${testValue.includes('FAIL') || testValue.includes('No Membership') ? 'text-red-500' : 'text-green-500'}`}>
                 Result: **{testValue}**
             </p>
             <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                 (Checks 'memberships' table for tier)
             </p>
          </div>

          {/* Box 2 */}
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
            
          </div>

          {/* Box 3 */}
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
            
          </div>

          {/* Box 4 */}
          <div className="h-32 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
            
          </div>

        </section>

        
        {/* The TWO Payment Boxes Sabesen & Daniel */}
        <section className="w-full flex flex-col md:flex-row gap-6">
          
          {/*Current Subscription Panel */}
          <div className="flex-1 min-w-[320px] h-96 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
            <SubscriptionPanel 
            currentPlan={currentPlan}
            formatValue={formatValue}
            formatDate={formatDate}
          />

          </div>


          {/* Make a Payment Form */}
          <div className="flex-1 min-w-[320px] h-96 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
            <PaymentForm />
          </div>

        </section>

      </div>
    </div>
  );
}

