"use client";

import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';


import PaymentForm from './PaymentForm';
import SubscriptionPanel from './SubscriptionPanel';
import BillingHistory from './BillingHistory';

interface SubscriptionType {
  plan_name: string | null;
  price: number | null;
  billing_cycle: string;
  is_active: boolean;
  member_since: string | null;
  next_renewal: string | null;
}

interface FetchedData {
  tier: string | null;
  status: string | null;
  created_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  plan_details?: { Cost: number | null };
}

async function fetchTestValue(userId: string) {
    if (!userId) return 'User ID Missing';
    
    // Querying the 'memberships' table for the user's tier
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


async function fetchSubscriptionData(userId: string): Promise<SubscriptionType | null> {
    if (!userId) return null;
    
    //obtain data from memberships table with joined plan details
    const { data, error } = await supabase
      .from('memberships') 
      .select(`tier, status, current_period_start, current_period_end, created_at, subscriptions ( Cost )`)
      .eq('user_id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('Supabase subscription fetch error:', error);
      throw error;
    }
    
    // Cast the retrieved data to the FetchedData interface to resolve type issues with joined fields
    const membershipData = data as FetchedData | null;

    if (membershipData) {
        
        // Safely extract price from the joined table data
        const price = membershipData.plan_details?.Cost ?? null; 
        
        const { tier, status, created_at, current_period_start, current_period_end } = membershipData;

        return {
            plan_name: tier,
            price: price, 
            billing_cycle: 'monthly', // Setting a standard billing cycle
            is_active: status === 'active',
            member_since: created_at || current_period_start,
            next_renewal: current_period_end,
        };
    }

    return null;
}


// Helper functions for formatting
const formatValue = (value: any): string => {
    // If value is null, return N/A instead of $0.00
    if (value === null || value === undefined) return 'N/A'; 
    return typeof value === 'number' ? `$${value.toFixed(2)}` : value || 'N/A';
};
  
const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    // Ensure input is a string or number recognized by Date constructor
    if (typeof dateString !== 'string' && typeof dateString !== 'number') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};


export default function PaymentsAndBilling() {

  // Reusing the SubscriptionType definition from above for consistency
  type CurrentSubscriptionType = SubscriptionType;

  const [subscription, setSubscription] = useState<CurrentSubscriptionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [testValue, setTestValue] = useState<string>('Checking Connection...');

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