import React from 'react';
import { Eye, Download, ChevronDown, CheckCircle } from 'lucide-react';

const KYCDocuments = ({ user }) => {
  // Mock KYC data for demonstration. In a real app, this would come from the user prop or an API call.
  const kycDocs = [
    {
      id: 'gov_id',
      name: 'Government ID',
      uploadedDate: '2023-12-16',
      status: 'Verified', // Can be 'Verified', 'Pending', 'Rejected'
      fileUrl: '#', // Placeholder for file URL
    },
    {
      id: 'selfie',
      name: 'Selfie',
      uploadedDate: '2023-12-16',
      status: 'Verified',
      fileUrl: '#',
    },
    {
      id: 'address_proof',
      name: 'Address Proof',
      uploadedDate: '2023-12-16',
      status: 'Verified',
      fileUrl: '#',
    },
  ];

  const handleStatusChange = (docId, newStatus) => {
    console.log(`Document ${docId} status changed to: ${newStatus}`);
    // In a real application, you would send this update to your backend API.
    // You might also update the local state to reflect the change.
  };

  const handlePreview = (doc) => {
    alert(`Previewing ${doc.name} for ${user.username}. (File: ${doc.fileUrl})`);
    // In a real application, this would open the document in a viewer.
  };

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.name} for ${user.username}. (File: ${doc.fileUrl})`);
    // In a real application, this would trigger a file download.
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">KYC Documents</h3>
      {kycDocs.map((doc) => (
        <div key={doc.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Placeholder for document icon/thumbnail */}
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
              DOC
            </div>
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{doc.name}</h4>
              <p className="text-sm text-gray-500">Uploaded: {doc.uploadedDate}</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={14} /> {doc.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePreview(doc)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              title="Preview Document"
            >
              <Eye size={16} /> Preview
            </button>
            <button
              onClick={() => handleDownload(doc)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              title="Download Document"
            >
              <Download size={16} /> Download
            </button>
            <div className="relative">
              <select
                value={doc.status}
                onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KYCDocuments;
