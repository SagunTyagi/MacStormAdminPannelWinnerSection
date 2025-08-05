import { useState, useRef, useEffect } from "react";
import { ArrowLeft, CreditCard, FileText, Gamepad, ScrollText, User, Wallet, CheckCircle, XCircle, Clock} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";



export default function UserDetail({ user, onBack, onKycStatusChange }) {
  const computeKycStatus = (docs) => {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
  return (
    <div
      ref={overviewRef}
      className="border rounded-lg p-4 mb-4 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-auto"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        User Information
      </h3>
      <table className="min-w-full text-sm border dark:border-zinc-700 rounded-lg overflow-hidden">
        <tbody className="divide-y dark:divide-zinc-700">
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">User ID</td>
            <td className="p-2">{user.id}</td>
          </tr>
          <tr>
            <td className="font-medium p-2">Username</td>
            <td className="p-2">{user.name}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Full Name</td>
            <td className="p-2">{user.fullName}</td>
          </tr>
          <tr>
            <td className="font-medium p-2">Email</td>
            <td className="p-2">{user.email}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Phone</td>
            <td className="p-2">{user.phone || "N/A"}</td>
          </tr>
          <tr>
            <td className="font-medium p-2">Location</td>
            <td className="p-2">{user.location}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Joined</td>
            <td className="p-2">{user.joined}</td>
          </tr>
          <tr>
            <td className="font-medium p-2">Last Active</td>
            <td className="p-2">{user.lastActive}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Status</td>
            <td className="p-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                    : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                }`}
              >
                {user.status}
              </span>
            </td>
          </tr>
          <tr>
           <td className="font-medium p-2">KYC Status</td>
           <td className="p-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              kycStatus === "Verified"
              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
              : kycStatus === "Rejected"
              ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
             }`}
             >
    {kycStatus}
    {kycStatus === "Verified" && <CheckCircle className="w-4 h-4" />}
    {kycStatus === "Rejected" && <XCircle className="w-4 h-4" />}
    {kycStatus !== "Verified" && kycStatus !== "Rejected" && (
      <Clock className="w-4 h-4" />
    )}
  </span>
</td>

          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Deposits</td>
            <td className="p-2 text-green-600">${user.deposits.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="font-medium p-2">Withdrawals</td>
            <td className="p-2 text-red-600">${user.withdrawals.toFixed(2)}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Balance</td>
            <td
              className={`p-2 ${
                user.balance >= 0 ? "text-blue-600" : "text-red-500"
              }`}
            >
              ${user.balance.toFixed(2)}
            </td>
          </tr>

          {/* 🏦 Banking Info Header */}
          <tr>
            <td colSpan={2} className="p-2 pt-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Banking Info
            </td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">Bank Name</td>
            <td className="p-2">{user.bank?.bankName || "N/A"}</td>
          </tr>
          <tr>
            <td className="font-medium p-2">Account No</td>
            <td className="p-2">{user.bank?.accountNumber || "N/A"}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-zinc-700">
            <td className="font-medium p-2">IFSC</td>
            <td className="p-2">{user.bank?.ifsc || "N/A"}</td>
          </tr>
          <tr> 
            <td className="font-medium p-2">UPI</td>
            <td className="p-2">{user.bank?.upiId || "N/A"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

      case "KYC Docs":
        return (
          <div className="border rounded-lg p-4 mb-4 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-4">KYC Documents</h3>
            {kycDocs.length > 0 ? (
              kycDocs.map((doc, index) => (
                <div key={index} className="flex justify-between items-start border rounded p-4 dark:border-zinc-600 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      {doc.url.endsWith(".pdf") ? (
                        <span className="text-sm text-center block mt-5">PDF</span>
                      ) : (
                        <img src={doc.url} alt={doc.type} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p className="text-sm text-gray-500">Uploaded: {doc.uploaded}</p>
                      <span className={`text-xs mt-1 px-2 py-1 inline-block rounded-full ${
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
                        className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                      >👁️ Preview</button>
                      <a
                        href={doc.url}
                        download
                        className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
                      >⬇️ Download</a>
                    </div>
                    <select
                      value={doc.status}
                      onChange={(e) => {
                        const updatedDocs = [...kycDocs];
                        updatedDocs[index].status = e.target.value;
                        setKycDocs(updatedDocs);
                      }}
                      className="text-sm mt-1 border px-2 py-1 rounded"
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
  return (
    <div className="border rounded-lg p-4 mb-4 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-1">Payment History</h3>
      <p className="text-sm text-gray-500 mb-4">Merged data from deposits and withdrawals</p>

      {user.payments && user.payments.length > 0 ? (
        <div className="space-y-4">
          {user.payments.map((txn, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-lg dark:border-zinc-600"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                    txn.type === "Deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {txn.type === "Deposit" ? "+" : "-"}
                </div>
                <div>
                  <p className="font-medium">{txn.id}</p>
                  <p className="text-sm text-gray-500">{txn.method}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    txn.type === "Deposit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "Deposit" ? "+" : "-"}${txn.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(txn.date).toLocaleString()}
                </p>
                <span
                  className={`mt-1 text-xs inline-block px-2 py-1 rounded-full ${
                    txn.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : txn.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
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
    <div className="border rounded-lg p-4 mb-4 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-1">Gameplay Statistics</h3>
      <p className="text-sm text-gray-500 mb-4">Data joined from match_lineups, player_stats</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-zinc-800">
          <p className="text-2xl font-bold">{gp.totalMatches}</p>
          <p className="text-sm text-gray-500">Total Matches</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-zinc-800">
          <p className="text-2xl font-bold text-green-600">{gp.wins}</p>
          <p className="text-sm text-gray-500">Wins</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-zinc-800">
          <p className="text-2xl font-bold text-blue-600">{gp.avgKills}</p>
          <p className="text-sm text-gray-500">Avg Kills</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md text-center dark:bg-zinc-800">
          <p className="text-2xl font-bold text-purple-600">{gp.winRate}%</p>
          <p className="text-sm text-gray-500">Win Rate</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <p className="text-sm font-medium">Current Team(s)</p>
          <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-200 rounded-full dark:bg-zinc-700">
            {gp.currentTeam}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium">Favorite Game</p>
          <p className="mt-1">{gp.favoriteGame}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Total Earnings</p>
          <p className="mt-1 text-green-600 font-semibold">${gp.totalEarnings?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

      case "Transactions":
  return (
    <div className="border rounded-lg p-4 mb-4 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-1">Transaction Ledger</h3>
      <p className="text-sm text-gray-500 mb-4">All financial operations related to the user</p>

      {user.transactions && user.transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border dark:border-zinc-600">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-2 text-left">Txn ID</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700">
              {user.transactions.map((txn, idx) => (
                <tr key={idx}>
                  <td className="p-2 font-medium">{txn.id}</td>
                  <td className="p-2">{txn.type}</td>
                  <td className="p-2">{txn.description}</td>
                  <td className={`p-2 font-semibold ${txn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                    {txn.type === "Credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                  </td>
                  <td className="p-2">{new Date(txn.date).toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      txn.status === "Success" ? "bg-green-100 text-green-700"
                      : txn.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No transactions found.</p>
      )}
    </div>
  );


      case "Audit Trail":
  return (
    <div className="border rounded-lg p-4 mb-4 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-2">Audit Trail</h3>
      <p className="text-sm text-gray-500 mb-4">Logs of admin actions and system changes</p>

      {user.auditTrail && user.auditTrail.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border dark:border-zinc-600">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Performed By</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700">
              {user.auditTrail.map((log) => (
                <tr key={log.id}>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2 font-medium">{log.performedBy}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      log.role === "Admin"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-white"
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    <div className="p-6 min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
      <button onClick={onBack} className="mb-6 flex items-center text-sm text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to KYC list
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">User Detail: {user.name}</h2>
        <span className={`text-xs px-2 py-1 rounded-full ${
          user.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {user.status}
        </span>
      </div>

      <div className="flex gap-2 border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
              activeTab === tab.name
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="mb-4 text-right">
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Download Overview as PDF
          </button>
        </div>
      )}

      <div>{renderTabContent()}</div>
    </div>
  );
}
