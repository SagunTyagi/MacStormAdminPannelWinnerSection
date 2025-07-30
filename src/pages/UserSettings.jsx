import React, { useState } from "react";

const userSettings = [
  {
    name: "John Doe",
    username: "ProGamer123",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    created: "2025-07-01",
    editedBy: null,
    history: [],
  },
  {
    name: "Jane Smith",
    username: "EliteQueen",
    email: "jane@example.com",
    role: "User",
    status: "Banned",
    created: "2025-06-21",
    editedBy: null,
    history: [],
  },
  {
    name: "Rahul Mehta",
    username: "CodeMaster",
    email: "rahul@example.com",
    role: "Moderator",
    status: "Active",
    created: "2025-07-20",
    editedBy: null,
    history: [],
  },
];

const permissions = {
  Admin: { edit: true, ban: true, reset: true },
  Moderator: { edit: true, ban: false, reset: true },
  User: { edit: false, ban: false, reset: false },
};

function UserSettings() {
  const [users, setUsers] = useState(userSettings);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredUsers = users
    .filter((u) =>
      filter === "all" ? true : u.status.toLowerCase() === filter.toLowerCase()
    )
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (user, type) => {
    const role = user.role;
    if (type === "edit" && !permissions[role].edit) {
      alert("Edit access is only allowed for Admins or Moderators.");
      return;
    }
    if (type === "ban" && !permissions[role].ban) {
      alert("Cannot ban Admins or Moderators.");
      return;
    }
    if (type === "reset" && !permissions[role].reset) {
      alert("Reset not allowed for this role.");
      return;
    }
    setSelectedUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleEdit = () => {
    const editedName = document.getElementById("editName").value;
    const editedUsername = document.getElementById("editUsername").value;
    const editedEmail = document.getElementById("editEmail").value;
    const editedRole = document.getElementById("editRole").value;

    const editor = selectedUser.role;
    const timestamp = new Date().toISOString();

    const updated = users.map((u) => {
      if (u.email === selectedUser.email) {
        const changes = {
          name: editedName !== u.name ? editedName : undefined,
          username: editedUsername !== u.username ? editedUsername : undefined,
          email: editedEmail !== u.email ? editedEmail : undefined,
          role: editedRole !== u.role ? editedRole : undefined,
        };

        const filteredChanges = Object.fromEntries(
          Object.entries(changes).filter(([_, v]) => v !== undefined)
        );

        return {
          ...u,
          name: editedName,
          username: editedUsername,
          email: editedEmail,
          role: editedRole,
          editedBy: `Edited by ${editor}`,
          history: [...u.history, { editedBy: editor, date: timestamp, changes: filteredChanges }],
        };
      }
      return u;
    });

    setUsers(updated);
    closeModal();
  };

  const handleReset = () => {
    alert(`Password reset link sent to ${selectedUser.email}`);
    closeModal();
  };

  const handleBan = () => {
    if (!permissions[selectedUser.role].ban) {
      alert("You cannot ban this user.");
      return;
    }
    const updated = users.map((u) =>
      u.email === selectedUser.email ? { ...u, status: "Banned" } : u
    );
    setUsers(updated);
    closeModal();
  };

  const toggleSelect = (email) => {
    setSelectedUsers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const selectAll = () => {
    const visibleEmails = paginatedUsers.map((u) => u.email);
    const allSelected = visibleEmails.every((email) => selectedUsers.includes(email));
    setSelectedUsers(allSelected ? [] : visibleEmails);
  };

  const handleBulkBan = () => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm("Ban selected users?")) return;
    const updated = users.map((u) =>
      selectedUsers.includes(u.email) && permissions[u.role].ban
        ? { ...u, status: "Banned" }
        : u
    );
    setUsers(updated);
    setSelectedUsers([]);
  };

  const handleExport = () => {
    const header = ["Name", "Username", "Email", "Role", "Status", "Created", "Edited By"];
    const rows = users.map((u) => [
      u.name,
      u.username,
      u.email,
      u.role,
      u.status,
      u.created,
      u.editedBy || ""
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-zinc-900 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Settings</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-zinc-700"
          />
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "active", "banned"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded capitalize ${filter === status ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-zinc-600"}`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={handleBulkBan}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={selectedUsers.length === 0}
        >
          Ban Selected ({selectedUsers.length})
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow bg-white dark:bg-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-700">
            <tr>
              <th className="px-4 py-2 text-left">
                <input type="checkbox" onChange={selectAll} checked={paginatedUsers.every(u => selectedUsers.includes(u.email))} />
              </th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Edited By</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.email} className="border-t border-gray-200 dark:border-zinc-700">
                <td className="px-4 py-2">
                  <input type="checkbox" checked={selectedUsers.includes(user.email)} onChange={() => toggleSelect(user.email)} />
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                   <span className={`px-2 py-1 rounded text-xs ${user.status === 'Active' ? 'bg-green-200 dark:bg-green-600 text-green-800 dark:text-white' : 'bg-red-200 dark:bg-red-600 text-red-800 dark:text-white'}`}>
                     {user.status}
                </span>               
                 </td>
                <td className="px-4 py-2">{user.created}</td>
                <td className="px-4 py-2">{user.editedBy || "-"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => openModal(user, "edit")} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
                  <button onClick={() => openModal(user, "reset")} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Reset</button>
                  <button onClick={() => openModal(user, "ban")} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && modalType === "edit" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <input id="editName" defaultValue={selectedUser.name} className="w-full mb-2 px-3 py-2 border rounded dark:bg-zinc-700" />
            <input id="editUsername" defaultValue={selectedUser.username} className="w-full mb-2 px-3 py-2 border rounded dark:bg-zinc-700" />
            <input id="editEmail" defaultValue={selectedUser.email} className="w-full mb-2 px-3 py-2 border rounded dark:bg-zinc-700" />
            <select id="editRole" defaultValue={selectedUser.role} className="w-full mb-3 px-3 py-2 border rounded dark:bg-zinc-700">
              <option>User</option>
              <option>Moderator</option>
              <option>Admin</option>
            </select>
            <button onClick={handleEdit} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button onClick={closeModal} className="mt-3 text-sm underline text-center w-full text-gray-600 dark:text-gray-300">Cancel</button>
          </div>
        </div>
      )}


      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserSettings;























