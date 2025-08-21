import React, { useState, useEffect } from "react";
import {
  EyeIcon,
  BanIcon,
  Search,
  Download,
  Trash,
  FolderArchive,
  Ellipsis,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import UserDetail from "./UserDetail";

const computeKycStatus = (docs) => {
  if (!docs?.length) return "Pending";
  if (docs.some((doc) => doc.status === "Rejected")) return "Rejected";
  if (docs.every((doc) => doc.status === "Verified")) return "Verified";
  return "Pending";
};

export default function UserKYC() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);
  const [walletUser, setWalletUser] = useState(null);
  const [assignUser, setAssignUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All Users");
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const admins = [
    { id: "admin1", name: "Admin One" },
    { id: "admin2", name: "Admin Two" },
    { id: "admin3", name: "Admin Three" },
  ];
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU1NTgxMTM1LCJleHAiOjE3NTY4NzcxMzV9.pJPjiFwxhxKH3uMWzCSI456e0zQnBMot_GvLgKwLf-A";
  // API fetching logic
  useEffect(() => {
    const fetchUsersAndTransactions = async () => {
      try {
        const usersResponse = await fetch("https://macstormbattle-backend.onrender.com/api/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const usersData = await usersResponse.json();


        const mappedUsersPromises = usersData.users.map(async (apiUser) => {
          let totalDeposits = 0;
          let totalWithdrawals = 0;
          let transactions = [];
          let allDeposits = [];
          let allwithdrawal = [];
          let depositData = undefined;
          let withdrawalData = undefined;

          try {
            const depositResponse = await fetch(
              `https://macstormbattle-backend.onrender.com/api/user/deposit/${apiUser.member_id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );

            if (depositResponse.ok) {
              depositData = await depositResponse.json();
              console.log("Deposit Data:", depositData);
              if (depositData.status && depositData.data) {
                totalDeposits = depositData.data.reduce(
                  (sum, record) => sum + Number(record.amount),
                  0
                );
                if (depositData?.data?.length > 0) {
                  allDeposits = depositData.data;
                  console.log("All Deposits:", allDeposits);
                }
              }
            }

            const withdrawalResponse = await fetch(
              `https://macstormbattle-backend.onrender.com/api/user/withdraw/${apiUser.member_id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            if (withdrawalResponse.ok) {
              withdrawalData = await withdrawalResponse.json();
              if (withdrawalData.status && withdrawalData.data) {
                totalWithdrawals = withdrawalData.data.reduce(
                  (sum, record) => sum + Number(record.amount),
                  0
                );
                if (withdrawalData?.data?.length > 0) {
                  allwithdrawal = withdrawalData.data;
                  console.log("All withdrawal:", allwithdrawal);
                }
              }
            }

            const transactionsResponse = await fetch(
              `https://macstormbattle-backend.onrender.com/api/match/transaction/${apiUser.member_id}/transactions`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            if (transactionsResponse.ok) {
              const transactionsData = await transactionsResponse.json();
              if (transactionsData?.transactions?.length > 0) {
                transactions = transactionsData.transactions;
              }
            }

          } catch (transactionError) {
            console.error(
              `Error fetching transactions for user ${apiUser.member_id}:`,
              transactionError
            );
          }

          const kycStatus = computeKycStatus(apiUser.kyc_docs);
          
          return {
            id: apiUser.member_id,
            name: apiUser.user_name || null,
            fullName: `${apiUser.first_name} ${apiUser.last_name}`,
            email: apiUser.email_id || null,
            location: apiUser.location || "Unknown",
            joined: apiUser.createdAt
              ? new Date(apiUser.createdAt).toLocaleDateString()
              : null,
            status: apiUser.member_status === 1 ? "Active" : "Suspended",
            kycStatus: kycStatus,
            kycDocs: apiUser.kyc_docs,
            balance: Number(apiUser.wallet_balance) || 0,
            deposits: totalDeposits,
            withdrawals: totalWithdrawals,
            lastActive: apiUser.updatedAt
              ? new Date(apiUser.updatedAt).toLocaleDateString()
              : null,
            assignedAdmin: null,
            bank: {
              bankName: apiUser.bank_name || "N/A",
              accountNumber: apiUser.account_number || "N/A",
              ifsc: apiUser.ifsc_code || "N/A",
              upiId: apiUser.upi_id || "N/A",
            },
            phone: "+1 (555) 123-4567",
            payments: [
              ...(
                allDeposits.map((deposit) => ({
                  ...deposit,
                  type: "Deposit",
                  status: depositData && typeof depositData.status !== 'undefined'
                    ? (depositData.status ? "success" : "failed")
                    : "unknown",
                }))
              ),
              ...(
                allwithdrawal.map((withdraw) => ({
                  ...withdraw,
                  type: "Withdrawal",
                  status: withdrawalData && typeof withdrawalData.status !== 'undefined'
                    ? (withdrawalData.status ? "success" : "failed")
                    : "unknown",
                }))
              ),
            ],

            gameplay: {
              totalMatches: 120,
              wins: 75,
              avgKills: 15.2,
              winRate: 62.5,
              currentTeam: "Team Alpha",
              favoriteGame: "Valorant",
              totalEarnings: 1500.75,
            },
            transactions: transactions,
            auditTrail: [
              { id: "AUD001", action: "Wallet Adjustment", performedBy: "Admin One", role: "Admin", timestamp: "2023-03-01T16:00:00Z" },
              { id: "AUD002", action: "KYC Document Verified", performedBy: "Admin Two", role: "Admin", timestamp: "2023-03-05T10:45:00Z" },
            ],
          };
        });

        const finalMappedUsers = await Promise.all(mappedUsersPromises);
        setUsers(finalMappedUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users or transactions:", err);
        setError("Failed to load users. Please check the API endpoint and token.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndTransactions();
  }, []);

  const handleBan = async (userId, currentStatus) => {
    const newMemberStatus = currentStatus === "Active" ? 0 : 1;
    const newStatusText = newMemberStatus === 0 ? "Suspended" : "Active";

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/member-status/admin/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            member_status: newMemberStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update user status: ${response.statusText}`);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                status: newStatusText,
              }
            : u
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(`Failed to update user status: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteUser) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/user/${deleteUser.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      } catch (err) {
        console.error("Error deleting user:", err);
        setError(`Failed to delete user: ${err.message}`);
      } finally {
        setDeleteUser(null);
      }
    }
  };

  const handleKycStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId ? { ...u, kycStatus: newStatus } : u
      )
    );
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    const isSearchMatch = 
      u.name?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);

    const isStatusMatch = 
      filterStatus === "All Users" ||
      filterStatus === u.status ||
      (filterStatus === "Pending KYC" && u.kycStatus === "Pending") ||
      (filterStatus === "Verified KYC" && u.kycStatus === "Verified") ||
      (filterStatus === "Rejected KYC" && u.kycStatus === "Rejected");

    return isSearchMatch && isStatusMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersOnCurrentPage = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const header = [
      "Name",
      "Full Name",
      "Email",
      "Location",
      "Joined",
      "Status",
      "KYC Status",
      "Deposits",
      "Withdrawals",
      "Balance",
      "Last Active",
      "Assigned Admin",
    ];
    const rows = users.map((u) => [
      u.name,
      u.fullName,
      u.email,
      u.location,
      u.joined,
      u.status,
      u.kycStatus,
      u.deposits,
      u.withdrawals,
      u.balance,
      u.lastActive,
      u.assignedAdmin || "-",
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
        authToken={authToken} 
      />
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 md:p-8">
      {showUserDetail && selectedUserDetail ? (
        <UserDetail
          user={selectedUserDetail}
          onBack={() => setShowUserDetail(false)}
          onKycStatusChange={handleKycStatusChange}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="mb-2 sm:mb-0">
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-sm text-gray-500">
                Server-paginated list of all registered accounts
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <h1 className="text-xl font-bold md:text-2xl">User Directory</h1>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow w-full sm:w-auto">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  value={filterStatus}
                  onChange={handleStatusFilterChange}
                >
                  <option value="All Users">All Users</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending KYC">Pending KYC</option>
                  <option value="Verified KYC">Verified KYC</option>
                  <option value="Rejected KYC">Rejected KYC</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {usersOnCurrentPage.length > 0 ? (
                usersOnCurrentPage.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 mr-4" />
                      <div className="flex-grow">
                        <div className="font-semibold flex flex-wrap items-center gap-2 mb-1">
                          {user.name}
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.kycStatus === "Verified"
                                ? "bg-green-100 text-green-700"
                                : user.kycStatus === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.kycStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.fullName}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-400 mt-1">
                          <div className="flex items-center mr-2">
                            <Mail className="w-3 h-3 mr-1" />
                            <span>{user.email}</span>
                          </div>
                          <span className="hidden sm:inline-block mr-2">|</span>
                          <span className="mr-2">📍 {user.location}</span>
                          <span className="hidden sm:inline-block mr-2">|</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Joined {user.joined}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between w-full md:w-auto text-sm gap-4 mt-4 md:mt-0">
                      <div className="text-left md:text-right w-1/2 md:w-auto">
                        <p className="text-sm text-green-600 font-medium">${user.deposits.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Deposits</p>
                      </div>
                      <div className="text-left md:text-right w-1/2 md:w-auto">
                        <p className="text-sm text-red-600 font-medium">${user.withdrawals.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Withdrawals</p>
                      </div>
                      <div className="text-left md:text-right w-1/2 md:w-auto">
                        <p className="text-sm text-blue-600 font-medium">${user.balance.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Balance</p>
                      </div>
                      <div className="text-left md:text-right w-1/2 md:w-auto">
                        <p className="text-sm text-gray-600 font-medium">{user.lastActive}</p>
                        <p className="text-xs text-gray-500">Last Active</p>
                      </div>
                      
                      <div className="flex space-x-2 text-gray-500 w-full md:w-auto justify-end">
                        <button onClick={() => handleViewDetails(user)} title="View Details">
                          <EyeIcon className="w-5 h-5 hover:text-blue-600" />
                        </button>
                        <button onClick={() => handleBan(user.id, user.status)} title={user.status === "Active" ? "Suspend User" : "Activate User"}>
                          {user.status === "Active" ? (
                            <BanIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-700" />
                          )}
                        </button>
                        <button onClick={() => setWalletUser(user)} title="Adjust Wallet">
                          <FolderArchive className="w-5 h-5 hover:text-yellow-600" />
                        </button>
                        <button onClick={() => setDeleteUser(user)} title="Delete User">
                          <Trash className="w-5 h-5 text-red-600 hover:text-red-700" />
                        </button>
                        <button onClick={() => setAssignUser(user)} title="Assign Admin">
                          <Ellipsis className="w-5 h-5 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found.</p>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t mt-4">
                <span className="text-sm text-gray-500 mb-2 sm:mb-0">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 rounded border disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 rounded border ${
                        currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                      }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 rounded border disabled:opacity-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {assignUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Assign User Work</h2>
            <p className="mb-4">
              Assign <strong>{assignUser.name}</strong> to an admin:
            </p>
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="w-full px-3 py-2 border rounded"
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
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedAdmin) return console.error("Please select an admin.");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-1">Wallet Adjustment</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adjust wallet balance for <strong>{walletUser.name}</strong>
            </p>
            <p className="mb-4">
              Current Balance: ${walletUser.balance?.toFixed(2) ?? "0.00"}
            </p>

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
                      amount: Number(e.target.value) || 0,
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
                    console.error("Enter a valid amount.");
                    return;
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

      {deleteUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete user{" "}
              <strong>{deleteUser.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteUser(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}