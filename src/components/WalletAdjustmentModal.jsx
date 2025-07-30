import React, { useState } from 'react';
import { Plus, X } from 'lucide-react'; // Using Lucide React for icons

export default function WalletAdjustmentModal({ user, onClose, onConfirmAdjustment }) {
  // Defensive check: If user is not provided or is null/undefined, don't render
  // The console.error has been removed as it was a debug message causing confusion.
  if (!user) {
    return null; // Don't render the modal if user is missing
  }

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit'); // 'credit' or 'debit'
  const [reason, setReason] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = () => {
    setErrorMessage(''); // Clear previous errors

    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    if (!reason.trim()) {
      setErrorMessage('Please enter a reason for the adjustment.');
      return;
    }
    if (!adminPin.trim()) {
      setErrorMessage('Please enter your Admin PIN.');
      return;
    }

    // In a real application, you would send this data to your backend API.
    // For now, we'll just log it and call the onConfirmAdjustment prop.
    const adjustmentData = {
      userId: user.id,
      username: user.username,
      currentBalance: user.balance,
      amount: parseFloat(amount),
      type: type,
      reason: reason.trim(),
      adminPin: adminPin.trim(), // In a real app, send securely (e.g., hashed or via secure method)
    };

    console.log('Confirming Wallet Adjustment:', adjustmentData);
    onConfirmAdjustment(adjustmentData); // Notify parent component
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative transform transition-all duration-300 scale-100 opacity-100">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Wallet Adjustment</h2>
        <p className="text-sm text-gray-600 mb-4">
          Adjust wallet balance for <span className="font-medium text-blue-700">{user.username}</span>
        </p>

        {/* Current Balance */}
        <div className="mb-4 text-lg font-medium text-gray-700">
          Current Balance: <span className="text-green-600">${user.balance.toFixed(2)}</span>
        </div>

        {/* Amount and Type */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm bg-white"
            >
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (-)</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for adjustment"
            rows="3"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm resize-y"
          ></textarea>
        </div>

        {/* Admin PIN */}
        <div className="mb-6">
          <label htmlFor="adminPin" className="block text-sm font-medium text-gray-700 mb-1">Admin PIN</label>
          <input
            type="password" // Use type="password" for sensitive info
            id="adminPin"
            name="adminPin"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            placeholder="Enter your admin PIN"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-600 text-sm mb-4 -mt-2">{errorMessage}</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleConfirm}
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <Plus size={18} /> Confirm Adjustment
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
