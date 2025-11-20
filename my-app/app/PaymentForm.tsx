"use client";


export default function PaymentForm() {
  // NOTE: Payment logic (form state, handleProcessPayment, etc.) would eventually live here.
  return (
    <div className="flex-1 min-w-[320px] p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Make a Payment</h2>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">Content for payment form.</p>
      
      {/* Placeholder form content for now */}
      <div className="h-48 border border-dashed border-gray-300 dark:border-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-400 mb-4">
        Form Elements Go Here (Amount, Method)
      </div>

      <button className="flex justify-center items-center w-full py-3 bg-black dark:bg-indigo-600 text-white font-medium rounded-lg transition">
          Process Payment
      </button>
    </div>
  );
}