import { useState, useRef, useEffect } from "react";
import { ArrowLeft, CreditCard, FileText, Gamepad, ScrollText, User, Wallet, CheckCircle, XCircle, Clock} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function UserDetail({ user, onBack, onKycStatusChange }) {
  const computeKycStatus = (docs) => {
    if (!docs?.length) return "Pending";
    if (docs.some((doc) => doc.status === "Rejected")) return "Rejected";
    if (docs.every((doc) => doc.status === "Verified")) return "Verified";
    return "Pending";
  };
  console.log({user})

  const [activeTab, setActiveTab] = useState("Overview");
  const [kycDocs, setKycDocs] = useState(user.kycDocs || []);
  const [kycStatus, setKycStatus] = useState(computeKycStatus(kycDocs));
  const overviewRef = useRef(null);

  useEffect(() => {
    const newStatus = computeKycStatus(kycDocs);
    setKycStatus(newStatus);
    if (onKycStatusChange) {
      onKycStatusChange(user.id, newStatus);
    }
  }, [kycDocs]);

  const handleExportPDF = () => {
    const input = overviewRef.current;
    if (!input) return;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`User_Overview_${user.name}.pdf`);
    });
  };

  const tabs = [
    { name: "Overview", icon: User },
    { name: "KYC Docs", icon: FileText },
    { name: "Payments", icon: Wallet },
    { name: "Gameplay", icon: Gamepad },
    { name: "Transactions", icon: CreditCard },
    { name: "Audit Trail", icon: ScrollText },
  ];
console.log({user})
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div ref={overviewRef}>
            <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Full Name</p>
                  <p className="mt-1">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Email</p>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Phone</p>
                  <p className="mt-1">{user.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Location</p>
                  <p className="mt-1">{user.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Bank/UPI Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Account Number</p>
                  <p className="mt-1">**** **** {user.bank?.accountNumber?.slice(-4) || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">IFSC Code</p>
                  <p className="mt-1">{user.bank?.ifsc || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">UPI ID</p>
                  <p className="mt-1">{user.bank?.upiId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Bank Name</p>
                  <p className="mt-1">{user.bank?.bankName || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "KYC Docs":
        return (
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">KYC Documents</h3>
            {kycDocs.length > 0 ? (
              kycDocs.map((doc, index) => (
                <div key={index} className="flex justify-between items-start border-b border-gray-200 py-4 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      {doc.url.endsWith(".pdf") ? (
                        <span className="text-sm text-center block mt-5">PDF</span>
                      ) : (
                        <img src={doc.url} alt={doc.type} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{doc.type}</p>
                      <p className="text-sm text-gray-500">Uploaded: {doc.uploaded}</p>
                      <span className={`text-xs mt-1 px-2 py-1 inline-block rounded-full font-medium ${
                        doc.status === "Verified" ? "bg-green-100 text-green-700" :
                        doc.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(doc.url, "_blank")}
                        className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                      >Preview</button>
                      <a
                        href={doc.url}
                        download
                        className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                      >Download</a>
                    </div>
                    <select
                      value={doc.status}
                      onChange={(e) => {
                        const updatedDocs = [...kycDocs];
                        updatedDocs[index].status = e.target.value;
                        setKycDocs(updatedDocs);
                      }}
                      className="text-sm mt-1 border border-gray-300 px-2 py-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </div>
        );
      
      case "Payments":
        // Sort payments by dd/mm/yyyy, hh:mm:ss am/pm string descending (newest first)
        const parseDDMMYYYYTime = (str) => {
          // Accepts 'dd/mm/yyyy, hh:mm:ss am/pm ...'
          if (!str) return 0;
          // Example: '05/08/2025, 12:13:56 pm'
          const [datePart, timePart, ampm] = str.split(/,| /).map(s => s.trim()).filter(Boolean);
          if (!datePart || !timePart) return 0;
          const [dd, mm, yyyy] = datePart.split('/').map(Number);
          let [hh, min, sec] = timePart.split(':').map(Number);
          let amPm = ampm ? ampm.toLowerCase() : '';
          if (amPm === 'pm' && hh < 12) hh += 12;
          if (amPm === 'am' && hh === 12) hh = 0;
          return new Date(yyyy, mm - 1, dd, hh, min, sec).getTime();
        };
        const sortedPayments = (user.payments || []).slice().sort((a, b) => parseDDMMYYYYTime(b.date) - parseDDMMYYYYTime(a.date));

        return (
          <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Payment History</h3>
            {sortedPayments.length > 0 ? (
              <div className="space-y-4">
                {sortedPayments.map((txn, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${txn.type === "Deposit" ? "bg-green-500" : "bg-red-500"}`}>
                        {txn.type === "Deposit" ? "+" : "-"}
                      </div>
                      <div>
                        {/* <p className="font-medium text-gray-800">{txn.id}</p> */}
                        <p className="text-sm text-gray-500">{txn.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${txn.type === "Deposit" ? "text-green-600" : "text-red-600"}`}>
                          {txn.type === "Deposit" ? "+" : "-"}${Number(txn.amount).toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${txn.type === "Deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {txn.type === "Deposit" ? "Deposit" : "Withdraw"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{txn.date}</p>
                      <span className={`mt-1 text-xs inline-block px-2 py-1 rounded-full ${txn.status === "success" ? "bg-green-100 text-green-700" : "bg-gray-100 text-red-600"}`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No payment history available.</p>
            )}
          </div>
        );

      case "Gameplay":
        const gp = user.gameplay || {};
        return (
          <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Gameplay Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{gp.totalMatches}</p>
                <p className="text-sm text-gray-500">Total Matches</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{gp.wins}</p>
                <p className="text-sm text-gray-500">Wins</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{gp.avgKills}</p>
                <p className="text-sm text-gray-500">Avg Kills</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{gp.winRate}%</p>
                <p className="text-sm text-gray-500">Win Rate</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Team(s)</p>
                <p className="mt-1 text-gray-800">{gp.currentTeam}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Favorite Game</p>
                <p className="mt-1 text-gray-800">{gp.favoriteGame}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="mt-1 text-green-600 font-semibold">${gp.totalEarnings?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );

      case "Transactions":
        return (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Transaction Ledger</h3>
            {user.transactions && user.transactions.length > 0 ? (
              <div>
                {/* Table for md+ screens, cards for mobile */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left text-gray-500">Type</th>
                        <th className="p-2 text-left text-gray-500">Description</th>
                        <th className="p-2 text-left text-gray-500">Amount</th>
                        <th className="p-2 text-left text-gray-500">Date</th>
                        <th className="p-2 text-left text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {user.transactions.map((txn, idx) => (
                        <tr key={idx}>
                          <td className="p-2">{txn.transaction_type || "N/A"}</td>
                          <td className="p-2">{txn.description || "N/A"}</td>
                          <td className={`p-2 font-semibold ${txn.transaction_type === "refund" ? "text-green-600" : "text-red-600"}`}>
                            {txn.transaction_type === "join" && txn.entry_fee ? `-$${(typeof txn.entry_fee === 'number' ? txn.entry_fee : 0).toFixed(2)}` : "N/A"}
                            {txn.transaction_type === "refund" && txn.refund_amount ? `+$${(typeof txn.refund_amount === 'number' ? txn.refund_amount : 0).toFixed(2)}` : "N/A"}
                          </td>
                          <td className="p-2">{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "N/A"}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${txn.transaction_type ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {txn.transaction_type ? "Success" : "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Card layout for mobile */}
                <div className="md:hidden flex flex-col gap-3">
                  {user.transactions.map((txn, idx) => (
                    <div key={idx} className="border rounded-lg p-3 bg-gray-50 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${txn.transaction_type ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{txn.transaction_type ? "Success" : "N/A"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Type: <span className="font-medium text-gray-700">{txn.transaction_type || "N/A"}</span></span>
                        <span>Description: <span className="font-medium text-gray-700">{txn.description || "N/A"}</span></span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Amount: <span className={`font-semibold ${txn.transaction_type === "refund" ? "text-green-600" : "text-red-600"}`}>
                          {txn.transaction_type === "join" && txn.entry_fee ? `-$${(typeof txn.entry_fee === 'number' ? txn.entry_fee : 0).toFixed(2)}` : "N/A"}
                          {txn.transaction_type === "refund" && txn.refund_amount ? `+$${(typeof txn.refund_amount === 'number' ? txn.refund_amount : 0).toFixed(2)}` : "N/A"}
                        </span></span>
                        <span>Date: <span className="font-medium text-gray-700">{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "N/A"}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No transactions found.</p>
            )}
          </div>
        );

      case "Audit Trail":
        return (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Audit Trail</h3>
            {user.auditTrail && user.auditTrail.length > 0 ? (
              <div>
                {/* Table for md+ screens, cards for mobile */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 text-left text-gray-500">Action</th>
                        <th className="p-2 text-left text-gray-500">Performed By</th>
                        <th className="p-2 text-left text-gray-500">Role</th>
                        <th className="p-2 text-left text-gray-500">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {user.auditTrail.map((log) => (
                        <tr key={log.id}>
                          <td className="p-2">{log.action}</td>
                          <td className="p-2 font-medium">{log.performedBy}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${log.role === "Admin" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{log.role}</span>
                          </td>
                          <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Card layout for mobile */}
                <div className="md:hidden flex flex-col gap-3">
                  {user.auditTrail.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 bg-gray-50 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{log.action}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${log.role === "Admin" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{log.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>By: <span className="font-medium text-gray-700">{log.performedBy}</span></span>
                        <span>Date: <span className="font-medium text-gray-700">{new Date(log.timestamp).toLocaleString()}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No audit logs available.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
            aria-label="Back to KYC list"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to KYC list</span>
          </button>
        </div>

        {/* User Card Header */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {user.name?.[0] || <User className="w-10 h-10" />}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold mr-2 break-all">{user.name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.status}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">User ID: {user.id} • Joined {user.joined}</p>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-xl shadow-md mb-6 border border-gray-200">
          <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                  activeTab === tab.name
                    ? "border-b-2 border-blue-600 text-blue-700 bg-blue-50"
                    : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-2 sm:p-4 md:p-6">
            {activeTab === "Overview" && (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleExportPDF}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md text-xs sm:text-sm font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Download Overview as PDF
                </button>
              </div>
            )}
            <div>{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}