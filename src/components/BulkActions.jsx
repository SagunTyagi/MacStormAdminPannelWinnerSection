import React, { useState } from 'react';
import { Users2 } from 'lucide-react'; // icon package

export default function BulkAction({ selectedUsers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [formData, setFormData] = useState({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAction('');
    setFormData({});
  };

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExecute = () => {
    console.log('Executing:', selectedAction, formData, selectedUsers);
    closeModal();
  };

  return (
    <>
      {/* Floating Button Styled Like Image */}
      {selectedUsers.length > 0 && (
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={openModal}
            className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            <Users2 size={18} className="text-gray-700" />
            <span className="text-gray-800 font-medium">
              Bulk Actions ({selectedUsers.length})
            </span>
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-1">Bulk Actions</h2>
            <p className="text-sm text-gray-500 mb-4">
              Perform actions on {selectedUsers.length} selected users
            </p>

            <label className="block mb-2 text-sm font-medium">Action Type</label>
            <select
              value={selectedAction}
              onChange={handleActionChange}
              className="w-full border px-3 py-2 mb-4 rounded"
            >
              <option value="">Select Action</option>
              <option value="ban">Mass Ban</option>
              <option value="push">Broadcast Push Notification</option>
              <option value="email">Broadcast Email</option>
            </select>

            {selectedAction === 'ban' && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Ban Reason</label>
                <textarea
                  name="banReason"
                  placeholder="Enter reason for ban"
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}

            {selectedAction === 'push' && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Push Message</label>
                <textarea
                  name="pushMessage"
                  placeholder="Enter push notification"
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}

            {selectedAction === 'email' && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Email Subject</label>
                <input
                  type="text"
                  name="emailSubject"
                  placeholder="Enter subject"
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 mb-2 rounded"
                />
                <label className="block text-sm mb-1">Email Message</label>
                <textarea
                  name="emailMessage"
                  placeholder="Enter message"
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={handleExecute}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Execute Action
              </button>
              <button
                onClick={closeModal}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
