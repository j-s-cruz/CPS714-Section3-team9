// This file is responsible for all communication with Supabase and data formatting.

import { supabase } from '../lib/supabase';

// --- Type Definition for Fetched Data (from DB) ---
interface FetchedData {
    tier: string;
    status: string;
    current_period_start: string | null;
    current_period_end: string | null;
    created_at: string | null;
    // The joined data is a single object { Cost: number } or null if no match found
    subscriptions: { Cost: number } | null; 
}

// --- Type Definition for Subscription Data (for Component) ---
export type SubscriptionType = {
    plan_name: string | null;
    price: number | null;
    billing_cycle: string;
    is_active: boolean;
    member_since: string | null;
    next_renewal: string | null;
};


// --- Helper Functions (Exported for component use) ---

export const formatValue = (value: any): string => {
    // Uses C$ symbol for Canadian Dollars (CAD)
    if (value === null || value === undefined) return 'N/A'; 
    return typeof value === 'number' ? `C$${value.toFixed(2)}` : value || 'N/A';
};
  
export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    if (typeof dateString !== 'string' && typeof dateString !== 'number') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};


// --- Supabase Fetching Functions (Exported) ---

export async function fetchTestValue(userId: string) {
    if (!userId) return 'User ID Missing';
    
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


export async function fetchSubscriptionData(userId: string): Promise<SubscriptionType | null> {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('memberships') 
      .select(`
        tier, 
        status, 
        current_period_start, 
        current_period_end, 
        created_at,
        subscriptions ( Cost ) 
      `)
      .eq('user_id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('Supabase subscription fetch error:', error);
      throw error;
    }
    
    const membershipData = data as FetchedData | null;

    if (membershipData) {
        
        const price = membershipData.subscriptions?.Cost ?? null; 
        
        const { tier, status, created_at, current_period_start, current_period_end } = membershipData;

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