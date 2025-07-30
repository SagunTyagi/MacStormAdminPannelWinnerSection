import React from 'react';
import { Shield } from 'lucide-react'; // Icon for audit trail entries

const AuditTrail = ({ user }) => {
  // Mock audit trail data for demonstration.
  // In a real application, this would be fetched from an API.
  const auditLogs = [
    {
      id: 'log_001',
      action: 'KYC VERIFIED',
      description: 'KYC documents verified and approved',
      admin: 'John Smith',
      timestamp: '2023-12-16 15:30:00',
    },
    {
      id: 'log_002',
      action: 'WALLET CREDIT',
      description: 'Manual wallet credit: +$100 - Tournament prize correction',
      admin: 'Sarah Johnson',
      timestamp: '2024-01-05 11:22:33',
    },
    {
      id: 'log_003',
      action: 'USER SUSPENDED',
      description: 'User suspended due to suspicious activity',
      admin: 'Admin User',
      timestamp: '2024-01-10 09:00:00',
    },
    {
      id: 'log_004',
      action: 'BANK DETAILS UPDATED',
      description: 'Bank account number updated by user request',
      admin: 'Admin User',
      timestamp: '2024-01-12 14:00:00',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Audit Trail</h3>
      <p className="text-sm text-gray-600 mb-6">Last 10 admin actions on this user</p>

      {auditLogs.map((log) => (
        <div key={log.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{log.action}</h4>
              <p className="text-sm text-gray-500">{log.description}</p>
              <p className="text-xs text-gray-400">Admin: {log.admin}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">{log.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditTrail;
