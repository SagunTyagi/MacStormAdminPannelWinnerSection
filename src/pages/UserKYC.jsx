import React, { useState } from "react";
import {
  EyeIcon,
  BanIcon,
  Search,
  Download,
  Trash,
  FolderArchive,
  Ellipsis,
} from "lucide-react";
import UserDetail from "./UserDetail";
import initialUsers from "../data/users";

//  Compute KYC status from docs
const computeKycStatus = (docs) => {
  if (!docs?.length) return "Pending";
  if (docs.some((doc) => doc.status === "Rejected")) return "Rejected";
  if (docs.every((doc) => doc.status === "Verified")) return "Verified";
  return "Pending";
};

export default function UserKYC() {

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [walletUser, setWalletUser] = useState(null);
  const [assignUser, setAssignUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  const admins = [
    { id: "admin1", name: "Admin One" },
    { id: "admin2", name: "Admin Two" },
    { id: "admin3", name: "Admin Three" },
  ];

  const handleBan = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Suspended" : "Active",
            }
          : u
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (deleteUser) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    }
  };

  const handleKycStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, kycStatus: newStatus } : u
      )
    );
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const header = [
      "Name",
      "Full Name",
      "Email",
      "Location",
      "Joined",
      "Status",
      "Verified",
      "Deposits",
      "Withdrawals",
      "Balance",
      "Last Active",
      "Assigned Admin"
    ];
    const rows = users.map((u) => [
      u.name,
      u.fullName,
      u.email,
      u.location,
      u.joined,
      u.status,
      u.verified ? "Yes" : "No",
      u.deposits,
      u.withdrawals,
      u.balance,
      u.lastActive,
      u.assignedAdmin || "-"
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "UserKYC_Export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onKycStatusUpdate={handleKycStatusChange}
      />
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">User KYC Management</h1>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 pr-10 rounded border dark:bg-zinc-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* User Cards */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const kycStatus = computeKycStatus(user.kycDocs || []);
          return (
            <div
              key={user.id}
              className="flex flex-col md:flex-row items-center justify-between p-4 rounded border shadow-sm bg-white dark:bg-zinc-800"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {user.name}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                          : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                      }`}
                    >
                      {user.status}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        kycStatus === "Verified"
                          ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                          : kycStatus === "Rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                      }`}
                    >
                      {kycStatus}
                    </span>
                  </div>
                  <p className="text-sm">{user.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📍 {user.location} • Joined {user.joined}
                  </p>
                  {user.assignedAdmin && (
                    <p className="text-xs mt-1 text-blue-600 dark:text-blue-300">
                      🧑 Assigned to: <strong>{user.assignedAdmin}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center justify-between flex-wrap gap-4 mt-4 md:mt-0 text-sm">
                <div className="text-green-600">${user.deposits.toFixed(2)}</div>
                <div className="text-red-600">${user.withdrawals.toFixed(2)}</div>
                <div className="text-blue-600">${user.balance.toFixed(2)}</div>
                <div className="text-xs text-center text-gray-600 dark:text-gray-400">
                  Last active
                  <br />
                  <strong>{user.lastActive}</strong>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => setSelectedUser(user)}>
                    <EyeIcon className="w-4 h-4 text-gray-700 dark:text-white" />
                  </button>
                  <button onClick={() => handleBan(user.id)}>
                    <BanIcon
                      className={`w-4 h-4 ${
                        user.status === "Active"
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button onClick={() => setWalletUser(user)}>
                    <FolderArchive className="w-4 h-4 text-gray-700 dark:text-white" />
                  </button>
                  <button onClick={() => setDeleteUser(user)}>
                    <Trash className="w-4 h-4 text-red-600" />
                  </button>
                  <button onClick={() => setAssignUser(user)}>
                    <Ellipsis className="w-4 h-4 text-gray-700 dark:text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Admin Modal */}
      {assignUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Assign User Work</h2>
            <p className="mb-4">
              Assign <strong>{assignUser.name}</strong> to an admin:
            </p>
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="w-full px-3 py-2 border rounded dark:bg-zinc-700"
            >
              <option value="">Select Admin</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.name}>
                  {admin.name}
                </option>
              ))}
            </select>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setAssignUser(null)}
                className="px-4 py-2 rounded border dark:border-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedAdmin) return alert("Please select an admin.");
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === assignUser.id
                        ? { ...u, assignedAdmin: selectedAdmin }
                        : u
                    )
                  );
                  setAssignUser(null);
                  setSelectedAdmin("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}


      {walletUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold mb-1">Wallet Adjustment</h2>
      <p className="text-sm text-gray-500 mb-4">
        Adjust wallet balance for <strong>{walletUser.name}</strong>
      </p>
      <p className="mb-4">
        Current Balance: ${walletUser.balance?.toFixed(2) ?? "0.00"}
      </p>

      {/* Form States */}
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Amount</label>
          <input
            type="number"
            min="0"
            placeholder="Enter amount"
            className="w-full px-3 py-2 border rounded"
            value={walletUser.amount || ""}
            onChange={(e) =>
              setWalletUser({
                ...walletUser,
                amount: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Type</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={walletUser.type || "credit"}
            onChange={(e) =>
              setWalletUser({ ...walletUser, type: e.target.value })
            }
          >
            <option value="credit">Credit (+)</option>
            <option value="debit">Debit (-)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Reason</label>
          <textarea
            rows={2}
            placeholder="Enter reason for adjustment"
            className="w-full px-3 py-2 border rounded"
            value={walletUser.reason || ""}
            onChange={(e) =>
              setWalletUser({ ...walletUser, reason: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Admin PIN</label>
          <input
            type="password"
            placeholder="Enter your admin PIN"
            className="w-full px-3 py-2 border rounded"
            value={walletUser.pin || ""}
            onChange={(e) =>
              setWalletUser({ ...walletUser, pin: e.target.value })
            }
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setWalletUser(null)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const { id, amount, type } = walletUser;
            if (!amount || amount <= 0) {
              return alert("Enter a valid amount.");
            }

            setUsers((prevUsers) =>
              prevUsers.map((u) => {
                if (u.id !== id) return u;

                const updatedDeposits = u.deposits || 0;
                const updatedWithdrawals = u.withdrawals || 0;
                const updatedBalance = u.balance || 0;

                if (type === "credit") {
                  return {
                    ...u,
                    deposits: updatedDeposits + amount,
                    balance: updatedBalance + amount,
                  };
                } else {
                  return {
                    ...u,
                    withdrawals: updatedWithdrawals + amount,
                    balance: updatedBalance - amount,
                  };
                }
              })
            );

            setWalletUser(null);
          }}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          + Confirm Adjustment
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
