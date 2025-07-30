import React from 'react';
import { FileText } from 'lucide-react'; // Icon for transactions

const InAppTransactions = ({ user }) => {
  // Mock in-app transaction data for demonstration.
  // In a real application, this would be fetched from the user prop or an API.
  const transactions = [
    {
      id: 'TXN-001',
      description: 'Premium Battle Pass',
      type: 'In App purchase',
      amount: 9.99,
      date: '2024-01-08 10:15:30',
    },
    {
      id: 'BET-001',
      description: 'Match #789 - Phoenix Warriors',
      type: 'Bet Placed',
      amount: 50.00,
      date: '2024-01-07 19:45:22',
    },
    {
      id: 'REF-001',
      description: 'Refund for Item X',
      type: 'Refund',
      amount: 5.00,
      date: '2024-01-06 11:00:00',
    },
    {
      id: 'TXN-002',
      description: 'Character Skin Pack',
      type: 'In App purchase',
      amount: 19.99,
      date: '2024-01-05 14:20:00',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">In-App Transactions</h3>
      <p className="text-sm text-gray-600 mb-6">In-app purchases, bets placed, refunds</p>

      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{transaction.id}</h4>
              <p className="text-sm text-gray-500">{transaction.description}</p>
              <p className="text-xs text-gray-400">{transaction.type}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-semibold text-lg text-gray-900">
              ${transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{transaction.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InAppTransactions;
