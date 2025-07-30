import React, { useState } from 'react';
import WalletAdjustmentModal from './WalletAdjustmentModal';
import {
  Eye,
  Ban,
  RotateCcw,
  Wallet,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from "lucide-react";


import ProfileDrawer from './ProfileDrawer';

const UserRow = ({ user, selected, toggleSelect, onBlock, onRefresh, onDelete }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const handleWalletClick = (e) => {
    e.stopPropagation();
    setShowWalletModal(true);
  };

  const handleCloseModal = () => {
    setShowWalletModal(false);
  };

  const handleConfirmAdjustment = (adjustmentData) => {
    // You can send adjustmentData to the server here
    // For now, just log it
    console.log('Wallet adjustment confirmed:', adjustmentData);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowProfileDrawer(true);
  };

  const handleCloseProfileDrawer = () => {
    setShowProfileDrawer(false);
  };

  return (
    <>
      <div
        className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-white transition-all duration-200 group hover:shadow-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
      >
      {/* Checkbox + Avatar + Info */}
      <div className="flex items-center gap-4 w-1/3">
        <input
          type="checkbox"
          className="w-4 h-4 accent-blue-500"
          checked={selected}
          onChange={toggleSelect}
        />
        <img
          src={user.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-all"
        />
        <div>
          <h4 className="font-semibold flex items-center gap-1 text-lg">
            {user.username}
            {user.status === "active" ? (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            ) : (
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Suspended
              </span>
            )}
            {user.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </h4>
          <p className="text-gray-500 font-medium">{user.name}</p>
          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
            <span>📧 {user.email}</span>
            <span>📍 {user.location}</span>
            <span>📅 Joined {user.joined}</span>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="flex justify-between gap-8 w-1/3">
        <div className="text-green-600 font-semibold text-sm text-center">
          ${user.deposits.toFixed(2)} <div className="text-xs text-gray-500">Deposits</div>
        </div>
        <div className="text-red-600 font-semibold text-sm text-center">
          ${user.withdrawals.toFixed(2)} <div className="text-xs text-gray-500">Withdrawals</div>
        </div>
        <div className="text-blue-600 font-semibold text-sm text-center">
          ${user.balance.toFixed(2)} <div className="text-xs text-gray-500">Balance</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-1/3 justify-end">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-medium text-black">Last active</div>
          <div>{user.lastActive}</div>
        </div>
        <Eye
          className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleProfileClick}
          title="View profile"
        />
        <Ban
          className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors"
          onClick={onBlock}
          title="Block user"
        />
        <RotateCcw
          className="w-5 h-5 cursor-pointer hover:text-yellow-500 transition-colors"
          onClick={onRefresh}
          title="Refresh user"
        />
        <Wallet
          className="w-5 h-5 cursor-pointer hover:text-green-600 transition-colors"
          onClick={handleWalletClick}
          title="Wallet adjustment"
        />
        <Trash2
          className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors"
          onClick={onDelete}
          title="Delete user"
        />
        <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-400 group-hover:text-black transition-colors" />
      </div>
      </div>
      {showWalletModal && (
        <WalletAdjustmentModal
          user={user}
          onClose={handleCloseModal}
          onConfirmAdjustment={handleConfirmAdjustment}
        />
      )}
      {showProfileDrawer && (
        <ProfileDrawer
          user={user}
          onClose={handleCloseProfileDrawer}
        />
      )}
    </>
  );
};

export default UserRow;
