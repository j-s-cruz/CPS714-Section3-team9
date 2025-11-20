"use client";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

import PaymentForm from './PaymentForm';
import SubscriptionPanel from './SubscriptionPanel'; 

interface MembershipData {
    tier: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    created_at: string;
    // The joined field, explicitly typed as the expected structure or null
    plan_details: { Cost: number } | null; 
}


// --- Final Data Fetching Functions ---

async function fetchTestValue(userId: string) {
    if (!userId) return null;
    
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
    
    // Querying 'memberships' and joining with 'subscriptions' to get the Cost/Price.
    const { data, error } = await supabase
      .from('memberships') 
      .select(`
        tier, 
        status, 
        current_period_start, 
        current_period_end, 
        created_at,
        
        // Join: Fetch Cost from the 'subscriptions' table where tier matches
        plan_details:subscriptions!tier ( Cost ) 
      `)
      .eq('user_id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('Supabase subscription fetch error:', error);
      throw error;
    }
    
    // ACTION: Apply Type Assertion to tell TypeScript the shape of the data object
    const typedData = data as MembershipData | null;
    
    if (typedData) {
        
        // 1. Safely handle the nested join structure. 
        const planDetails = typedData.plan_details;
        
        // 2. Extract the cost with safe chaining (?? 0 provides a default).
        const price = planDetails?.Cost ?? 0;
        
        // 3. Destructure primary fields for cleaner access.
        const { tier, status, created_at, current_period_start, current_period_end } = typedData;

        return {
            plan_name: tier,
            price: price, 
            billing_cycle: 'monthly', 
            is_active: status === 'active',
            member_since: created_at || current_period_start,
            next_renewal: current_period_end,
        };
    }

    return null;
}

async function fetchPaymentMethods(userId: string) {
    if (!userId) return [];
    
    // NOTE: This assumes you have a 'payment_methods' table set up in Supabase
    const { data, error } = await supabase
        .from('payment_methods')
        .select('id, card_type, last_four, is_default')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

    if (error) {
        console.error('Supabase payment methods fetch error:', error);
        return [];
    }
    return data;
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

  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(0.00);
  
  // NEW STATE FOR TEST
  const [testValue, setTestValue] = useState('Checking Connection...');

  // I used my UserID
  const mockUserId = '49f7c14c-1c83-49fc-8701-38043efdb920'; 
  
  // Combined data fetching hook
  useEffect(() => {
    const loadData = async () => {
      if (!mockUserId) { setLoading(false); return; }
      
      try {
       
        const testResult = await fetchTestValue(mockUserId);
        setTestValue(testResult ?? 'TEST: No Profile Found');
        
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

