import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { users as allUsers } from "../utils/users";
import UserRow from "../components/UserRow";
import { RotateCw } from "lucide-react";
import ProfileDrawer from "../components/ProfileDrawer";
import BulkAction from "../components/BulkActions";



const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [usersPerPage, setUsersPerPage] = useState(15);
  const [loading, setLoading] = useState(false);

  // Apply search + filter
  const filteredUsers = React.useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch = user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(start, start + usersPerPage);


  const toggleUserSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Handler for block, refresh, delete actions
  const handleUserAction = (userId, action) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Optionally, you can show a toast or update state here if needed
    }, 700); // 700ms loading
  };

  const toggleSelectAll = () => {
    const currentPageIds = paginatedUsers.map((u) => u.id);
    const isAllSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  // Get selected user objects for BulkAction
  const selectedUsers = allUsers.filter((u) => selectedIds.includes(u.id));

  return (
    <div className="p-4 relative">
      {/* Header with BulkAction floating to the right */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <BulkAction selectedUsers={selectedUsers} />
      </div>

      <div className="border border-blue-300 rounded-xl bg-white/70 shadow-sm p-0">
        {/* 🔍 Search + Filter + Page Size + User Directory headline */}
        <div className="flex flex-wrap items-center gap-4 px-6 pt-6 pb-4 justify-between">
          <h2 className="text-lg font-semibold text-blue-900">User Directory</h2>
          <div className="flex gap-2 bg-white border border-blue-200 rounded-xl shadow px-4 py-2 items-center">
            <input
              type="text"
              placeholder="🔍 Search users..."
              className="border border-blue-200 outline-none px-4 py-2 rounded-lg bg-blue-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all w-56 text-base shadow-sm placeholder:text-blue-400 hover:bg-blue-100"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            <select
              className="border border-blue-200 outline-none px-3 py-2 rounded-lg bg-blue-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all text-base cursor-pointer shadow-sm hover:bg-blue-100"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              className="border border-blue-200 outline-none px-3 py-2 rounded-lg bg-blue-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all text-base cursor-pointer shadow-sm hover:bg-blue-100"
              value={usersPerPage}
              onChange={(e) => {
                setUsersPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* 🧾 User List with Checkboxes */}
        <div className="flex flex-col gap-2 px-6 pb-2">
          {/* Select All Checkbox */}
          <div className="flex items-center mb-2 px-2 py-1 bg-gradient-to-r from-blue-100 via-blue-50 to-white border border-blue-300 rounded-md shadow-sm w-full group transition-all min-h-[36px]">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600 mr-3 group-hover:scale-110 transition-transform duration-150 border border-blue-400 shadow-sm"
              checked={
                paginatedUsers.length > 0 &&
                paginatedUsers.every((u) => selectedIds.includes(u.id))
              }
              onChange={toggleSelectAll}
            />
            <span className="text-base font-bold text-blue-800 select-none group-hover:text-blue-900 transition-colors flex-1 tracking-wide drop-shadow-sm">
              {selectedIds.length > 0
                ? `${selectedIds.length} user${selectedIds.length > 1 ? 's' : ''} selected`
                : 'Select All'}
            </span>
          </div>

          {/* Rows - scrollable area */}
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {loading ? (
              <div className="flex items-center justify-center py-8 w-full text-blue-700 font-semibold text-lg gap-2 animate-pulse">
                <RotateCw className="animate-spin w-6 h-6 mr-2" />
                Loading users...
              </div>
            ) : (
              paginatedUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  selected={selectedIds.includes(user.id)}
                  toggleSelect={() => toggleUserSelect(user.id)}
                  onBlock={() => handleUserAction(user.id, 'block')}
                  onRefresh={() => handleUserAction(user.id, 'refresh')}
                  onDelete={() => handleUserAction(user.id, 'delete')}
                />
              ))
            )}
          </div>
        </div>

        {/* 🔢 Pagination */}
        <div className="mt-4 flex justify-center items-center gap-4 pb-6">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* 🪟 Profile Drawer */}
      {selectedUser && (
        <ProfileDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UsersPage;
