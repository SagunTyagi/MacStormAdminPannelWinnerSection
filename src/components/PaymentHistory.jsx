import React from 'react';
import { Plus, Minus } from 'lucide-react'; // Icons for deposit/withdrawal

const PaymentHistory = ({ user }) => {
  // Mock payment data for demonstration.
  // In a real application, this would be fetched from the user prop or an API.
  const payments = [
    {
      id: 'tx_001',
      type: 'deposit',
      method: 'UPI',
      amount: 500.00,
      date: '2024-01-08 14:32:15',
      status: 'Active',
    },
    {
      id: 'tx_002',
      type: 'withdrawal',
      method: 'Bank Transfer',
      amount: 250.00,
      date: '2024-01-08 12:18:45',
      status: 'Pending',
    },
    {
      id: 'tx_003',
      type: 'deposit',
      method: 'Credit Card',
      amount: 1000.00,
      date: '2024-01-07 10:00:00',
      status: 'Active',
    },
    {
      id: 'tx_004',
      type: 'withdrawal',
      method: 'Crypto',
      amount: 150.00,
      date: '2024-01-06 16:30:00',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h3>
      <p className="text-sm text-gray-600 mb-6">Merged data from deposits and withdrawals</p>

      {payments.map((payment) => (
        <div key={payment.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center
              ${payment.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {payment.type === 'deposit' ? <Plus size={24} /> : <Minus size={24} />}
            </div>
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{payment.id}</h4>
              <p className="text-sm text-gray-500">{payment.method}</p>
            </div>
          </div>

          <div className="text-right">
            <p className={`font-semibold text-lg ${payment.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
              {payment.type === 'deposit' ? '+' : '-'}${payment.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{payment.date}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
              ${payment.status === 'Active' ? 'bg-green-100 text-green-700' :
                 payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                 'bg-gray-100 text-gray-700'}`}>
              {payment.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentHistory;
