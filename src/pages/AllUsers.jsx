import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // You can make this configurable
  const [totalUsers, setTotalUsers] = useState(0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newName, setNewName] = useState("");

const columns = [
  { key: "sr_no", label: "Sr No." },
  { key: "member_id", label: "Member ID" },
  { key: "first_name", label: "Name" },
  { key: "user_name", label: "User Name" },
  { key: "email_id", label: "Email" },
  { key: "mobile_no", label: "Mobile No" },
  { key: "refer_code", label: "Referral No" },
  { key: "subscription_type", label: "Subscription Type" },   
  { key: "subscription_date", label: "Subscription Date" }, 
  { key: "actions", label: "Actions" },
];

const fetchUsers = async () => {
  try {
    const res = await axiosInstance.get("auth/user");
    const data = Array.isArray(res.data.users) ? res.data.users : [];

    const formattedUsers = data.map((user, index) => ({
      ...user,
      sr_no: index + 1, // Serial number for display
      subscription_type: user.subscription_type ? user.subscription_type : "Free",
      subscription_date: user.subscription_date ? user.subscription_date : "N/A", 
      refer_code: user.refer_code ? user.refer_code : "N/A"
    }));

    setUsers(formattedUsers);
    setTotalUsers(formattedUsers.length);
  } catch (err) {
    console.error("Error fetching users:", err);
    toast.error("Failed to fetch users");
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Update sr_no for current page display
  const paginatedUsers = currentUsers.map((user, index) => ({
    ...user,
    sr_no: indexOfFirstUser + index + 1
  }));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ---- EDIT ----
  const handleEdit = (row) => {
    setSelectedUser(row);
    setNewName(row.first_name || "");
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!newName || newName === selectedUser.first_name) {
      setIsEditModalOpen(false);
      return;
    }
    try {
      await axiosInstance.put(`auth/user/${selectedUser.member_id}`, { first_name: newName });
      
      // Update the user in the current state without refetching
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.member_id === selectedUser.member_id 
            ? { ...user, first_name: newName }
            : user
        )
      );
      
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update user");
    }
  };

  // ---- DELETE ----
  const handleDelete = (row) => {
    setSelectedUser(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`auth/user/${selectedUser.member_id}`);
      
      // Remove user from state and adjust pagination if needed
      const updatedUsers = users.filter(user => user.member_id !== selectedUser.member_id);
      setUsers(updatedUsers);
      setTotalUsers(updatedUsers.length);
      
      // If current page becomes empty after deletion, go to previous page
      const newTotalPages = Math.ceil(updatedUsers.length / usersPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user");
    }
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, totalUsers)} of {totalUsers} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {/* First page */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 py-2 text-gray-400 dark:text-gray-600">...</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}

          {/* Last page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 py-2 text-gray-400 dark:text-gray-600">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage all registered users and their information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.filter(u => u.member_status === 1).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium Users</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{users.filter(u => u.subscription_type && u.subscription_type !== 'Free').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          
          <Table
            columns={columns}
            data={paginatedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          {/* Pagination */}
          {totalPages > 1 && <Pagination />}
        </div>
      </div>

      {/* ---- Edit Modal ---- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-96 mx-4 transform transition-all">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit User
              </h2>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member ID
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">#{selectedUser?.member_id}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter new name"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Delete Modal ---- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-96 mx-4 transform transition-all">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Delete User
              </h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900 dark:text-white">{selectedUser?.first_name}</span>?
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-400 mb-1">
                  <strong>Member ID:</strong> #{selectedUser?.member_id}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;