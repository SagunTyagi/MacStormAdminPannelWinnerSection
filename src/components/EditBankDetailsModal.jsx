import React, { useState } from 'react';
import { X } from 'lucide-react'; // Import X icon for closing

const EditBankDetailsModal = ({ user, onClose, onSave }) => {
  // Defensive check: If user is not provided or is null/undefined, don't render
  if (!user) {
    return null;
  }

  const [accountNumber, setAccountNumber] = useState(user.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(user.ifscCode || '');
  const [upiId, setUpiId] = useState(user.upiId || '');
  const [bankName, setBankName] = useState(user.bankName || '');
  const [accountHolderName, setAccountHolderName] = useState(user.fullName || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    setErrorMessage('');
    if (!accountNumber.trim() || !ifscCode.trim() || !upiId.trim() || !bankName.trim() || !accountHolderName.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }
    const updatedBankDetails = {
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim(),
      upiId: upiId.trim(),
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
    };
    console.log('Saving Bank Details:', updatedBankDetails);
    onSave(updatedBankDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative transform transition-all duration-300 scale-100 opacity-100">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Edit Bank Details</h2>
        <p className="text-sm text-gray-600 mb-4">
          Update bank and UPI information for <span className="font-medium text-blue-700">{user.username}</span>
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="Enter IFSC code"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
          <input
            type="text"
            id="upiId"
            name="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter UPI ID"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="Enter account holder name"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-600 text-sm mb-4 -mt-2">{errorMessage}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Save Changes
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
};

export default EditBankDetailsModal;
