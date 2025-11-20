import { supabase } from '../lib/supabase';

export default function PaymentsAndBilling() {
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
            
          </div>

          {/* Make a Payment Form */}
          <div className="flex-1 min-w-[320px] h-96 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
            
          </div>

        </section>

      </div>
    </div>
  );
}