'use client';

import React from 'react';


interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Failed' | 'Pending';
}

interface BillingHistoryTableProps {
  invoices: Invoice[];
}

// --- BillingHistoryTable Component ---
export default function BillingHistoryTable({ invoices }: BillingHistoryTableProps) {
  // Simple function to simulate downloading the invoice PDF
  const handleViewInvoice = (invoiceId: string) => {
    console.log(`Simulating view/download for Invoice: ${invoiceId}`);
    alert(`Downloading Invoice ${invoiceId}... (This would call your API to generate a PDF)`);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h3 className="text-xl font-semibold">View and download your invoices and receipts</h3>
        <div className="flex space-x-3">
          {/* Filter/Year Selection */}
          <select className="border rounded-md p-2 text-sm">
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
          {/* Export Button */}
          <button className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg">
            ⬇️ Export All
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  📄 {invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${invoice.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      invoice.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewInvoice(invoice.id)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    <span className="mr-1">👁️</span> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Handle case with no invoices */}
      {invoices.length === 0 && (
        <p className="text-center py-8 text-gray-500">No billing history found.</p>
      )}
    </div>
  );
}