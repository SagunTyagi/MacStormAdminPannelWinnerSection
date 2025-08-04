import { useState } from "react";
import { Eye, Pencil, Ban, ShieldCheck, Crown, RefreshCcw } from "lucide-react";
import { Admins as initialAdmins } from "../data/users";

const AdminManagement = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);


  const openEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditedName(admin.name);
    setEditedEmail(admin.email);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === selectedAdmin.id
          ? { ...admin, name: editedName, email: editedEmail }
          : admin
      )
    );
    setIsEditOpen(false);
  };

  const confirmBlock = () => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === selectedAdmin.id
          ? { ...admin, status: "Suspended" }
          : admin
      )
    );
    setIsBlockOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 text-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Crown className="text-purple-800 w-6 h-6" />
            Super Admin Panel
          </h1>
          <p className="text-sm text-gray-500">
            Deep system oversight and administrative controls
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100">
          <RefreshCcw size={14} /> Refresh Data
        </button>
      </div>

      {/* Admin Management */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Admin Management
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Data source: <code>Admins</code>, <code>admin_permissions</code> tables
        </p>

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-gray-50 p-4 rounded border shadow-sm flex justify-between items-center mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{admin.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {admin.role}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${admin.status === "Suspended" ? "bg-red-100 text-red-700" : "bg-black text-white"}`}>
                    {admin.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{admin.email}</div>
                <div className="text-xs text-gray-400">Last login: {admin.lastLogin}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-blue-600 hover:underline">
                {admin.permissions} permissions
              </a>
              <Eye
                className="w-4 h-4 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => {
                setSelectedAdmin(admin);
                setIsViewOpen(true);
              }}
            />

              <Pencil
                className="w-4 h-4 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => openEdit(admin)}
              />
              <Ban
                className="w-4 h-4 cursor-pointer text-red-600 hover:text-red-800"
                onClick={() => {
                  setSelectedAdmin(admin);
                  setIsBlockOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>


      {isViewOpen && selectedAdmin && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-[350px]">
      <h2 className="text-lg font-bold mb-4">View Admin Details</h2>
      <div className="mb-3">
        <strong>Name:</strong> <span>{selectedAdmin.name}</span>
      </div>
      <div className="mb-3">
        <strong>Email:</strong> <span>{selectedAdmin.email}</span>
      </div>
      <div className="mb-3">
        <strong>Role:</strong> <span>{selectedAdmin.role}</span>
      </div>
      <div className="mb-3">
        <strong>Status:</strong>{" "}
        <span
          className={`px-2 py-0.5 rounded text-sm ${
            selectedAdmin.status === "Suspended"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {selectedAdmin.status}
        </span>
      </div>
      <div className="mb-3">
        <strong>Last Login:</strong> <span>{selectedAdmin.lastLogin}</span>
      </div>
      <div className="mb-3">
        <strong>Permissions:</strong> <span>{selectedAdmin.permissions}</span>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setIsViewOpen(false)}
          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* ✏️ Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
            <h2 className="text-lg font-bold mb-4">Edit Admin</h2>
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border w-full mb-3 px-2 py-1 rounded"
              placeholder="Name"
            />
            <input
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="border w-full mb-3 px-2 py-1 rounded"
              placeholder="Email"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚫 Block Confirmation Modal */}
      {isBlockOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
            <h2 className="text-lg font-bold mb-4">Confirm Block</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to suspend {selectedAdmin.name}'s account?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsBlockOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;

