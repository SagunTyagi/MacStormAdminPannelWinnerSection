import React, { useState } from 'react';
import { X, Edit, CheckCircle } from 'lucide-react'; // Import necessary icons
import EditBankDetailsModal from './EditBankDetailsModal';
import KYCDocuments from './KYCDocuments';
import PaymentHistory from './PaymentHistory';
import GameplayStatistics from './GameplayStatistics';
import InAppTransactions from './InAppTransactions';
import AuditTrail from './AuditTrail';

const ProfileDrawer = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: user.accountNumber,
    ifscCode: user.ifscCode,
    upiId: user.upiId,
    bankName: user.bankName,
    accountHolderName: user.fullName,
  });

  if (!user) {
    return null; // Don't render if user is null or undefined
  }

  const tabs = ['Overview', 'KYC Docs', 'Payments', 'Gameplay', 'Transactions', 'Audit Trail'];

  const handleEditBank = () => {
    setShowEditBankModal(true);
  };

  const handleCloseEditBank = () => {
    setShowEditBankModal(false);
  };

  const handleSaveBankDetails = (updated) => {
    setBankDetails(updated);
  };

  return (
    <>
      {/* Blurred overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 w-[750px] h-full bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {user.username}
            {user.status === "active" ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                Active
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Suspended
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            User ID: <span className="font-medium">{user.id}</span> • Joined: <span className="font-medium">{user.joined}</span>
          </p>
        </div>
        <button
          className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          onClick={onClose}
          aria-label="Close drawer"
        >
          <X size={20} />
        </button>
        </div>
      

        {/* Tabs */}
        <div className="flex gap-2 px-2 py-3 bg-white border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                ${activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6">
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{user.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Bank/UPI Details</h3>
                <button
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                  onClick={handleEditBank}
                >
                  <Edit size={16} /> Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-gray-500">Account Number</p>
                  <p className="font-medium text-gray-900">{bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">IFSC Code</p>
                  <p className="font-medium text-gray-900">{bankDetails.ifscCode}</p>
                </div>
                <div>
                  <p className="text-gray-500">UPI ID</p>
                  <p className="font-medium text-gray-900">{bankDetails.upiId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Bank Name</p>
                  <p className="font-medium text-gray-900">{bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Holder Name</p>
                  <p className="font-medium text-gray-900">{bankDetails.accountHolderName}</p>
                </div>
              </div>
            </div>
            {showEditBankModal && (
              <EditBankDetailsModal
                user={{ ...user, ...bankDetails }}
                onClose={handleCloseEditBank}
                onSave={handleSaveBankDetails}
              />
            )}
          </div>
        )}
        {activeTab === 'KYC Docs' && (
          <KYCDocuments user={user} />
        )}
        {activeTab === 'Payments' && (
          <PaymentHistory user={user} />
        )}
        {activeTab === 'Gameplay' && (
          <GameplayStatistics user={user} />
        )}
        {activeTab === 'Transactions' && (
          <InAppTransactions user={user} />
        )}
        {activeTab === 'Audit Trail' && (
          <AuditTrail user={user} />
        )}
        {activeTab !== 'Overview' && activeTab !== 'KYC Docs' && activeTab !== 'Payments' && activeTab !== 'Gameplay' && activeTab !== 'Transactions' && activeTab !== 'Audit Trail' && (
          <p className="text-gray-600 text-center py-10">
            Content for {activeTab} tab will appear here.
          </p>
        )}
      </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
