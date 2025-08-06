import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Directly hardcoded for now (not recommended for production)
const API_BASE = "https://macstormbattle-backend.onrender.com";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU0MzY5NzkwLCJleHAiOjE3NTU2NjU3OTB9.B6xvX5qEONmozHu-3pmDu7e0nzBzmMj89AtQ60MM9-I";

function WithdrawRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/user/withdraw`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data);
    } catch (err) {
      console.error("Failed to fetch withdrawals", err);
    }
  };
    const updateStatus = async (withdrawal, status) => {
    const userId = withdrawal.userId;
    if (!userId) {
        console.error("No userId found for withdrawal:", withdrawal);
        return;
    }

    try {
    await axios.put(
        `${API_BASE}/api/user/withdraw/user/${userId}/status`,
        { status },
        {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        }
    );

    setRequests((prev) =>
        prev.map((req) => (req.userId === userId ? { ...req, status } : req))
    );

    toast.success(`Withdrawal ${status} successfully!`);
    } catch (err) {
    console.error(`Failed to update status for userId ${userId}`, err);
    const message = err.response?.data?.message || "Something went wrong";
    toast.error(message);
    if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
    }
    }

    };



  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 relative">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold dark:text-white">
          Wallet Management
        </h1>
        <button
          onClick={fetchRequests}
          className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800"
        >
          ⟳ Refresh
        </button>
      </div>

    <div className="mb-4">
    <input
        type="text"
        placeholder="Search by user or id..."
        className="w-full max-w-sm px-3 py-2 rounded border border-gray-300
                bg-white text-black placeholder-gray-500
                dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400
                dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    </div>


      <div className="bg-white dark:bg-zinc-800 rounded shadow p-4 overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-white">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-zinc-50 dark:hover:bg-zinc-700">
                <td className="p-3">
                  {req.User?.user_name || `User ${req.userId}`}
                </td>
                <td className="p-3">₹{req.amount}</td>
                <td className="p-3">{req.payment_method || "N/A"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      req.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(req.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    onClick={() => updateStatus(req, "approved")}
                    disabled={req.status !== "pending"}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    onClick={() => updateStatus(req, "rejected")}
                    disabled={req.status === "rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-zinc-500 py-6">
                  No withdrawal requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WithdrawRequests;
