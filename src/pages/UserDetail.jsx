import { useState, useRef, useEffect } from "react";
import { ArrowLeft, CreditCard, FileText, Gamepad, ScrollText, User, Wallet, CheckCircle, XCircle, Clock } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function UserDetail({ user, onBack, onKycStatusChange, authToken }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [kycData, setKycData] = useState(null);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const overviewRef = useRef(null);

  // Fetch KYC data when component mounts
  useEffect(() => {
    const fetchKycData = async () => {
      setLoadingKyc(true);
      try {
        const response = await fetch(
          `https://macstormbattle-backend.onrender.com/api/userkyc/user/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setKycData(data.data); // Make sure to set data.data since API returns { data: {...} }
          console.log("KYC Data:", data.data); // Debug log
        } else {
          console.error("Failed to fetch KYC data:", response.status);
          setKycData(null);
        }
      } catch (error) {
        console.error("Error fetching KYC data:", error);
        setKycData(null);
      } finally {
        setLoadingKyc(false);
      }
    };

    fetchKycData();
  }, [user.id, authToken]);

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

  const renderDocumentStatus = (status) => {
    if (!status) return null;
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
        status === "verified" ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white" :
        status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white" :
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
      }`}>
        {statusText}
        {status === "verified" && <CheckCircle className="w-3 h-3" />}
        {status === "rejected" && <XCircle className="w-3 h-3" />}
        {status === "pending" && <Clock className="w-3 h-3" />}
      </span>
    );
  };

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
                  <td className="p-2">{kycData?.phone || "N/A"}</td>
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
                    {renderDocumentStatus(kycData?.status)}
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

                {/* KYC Documents Section */}
                <tr>
                  <td colSpan={2} className="p-2 pt-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    KYC Documents
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-zinc-700">
                  <td className="font-medium p-2">Aadhaar Card</td>
                  <td className="p-2">
                    {kycData?.aadhaar_card_number ? (
                      <span className="font-mono">{kycData.aadhaar_card_number}</span>
                    ) : (
                      "Not provided"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-2">PAN Card</td>
                  <td className="p-2">
                    {kycData?.pan_card_number ? (
                      <span className="font-mono">{kycData.pan_card_number}</span>
                    ) : (
                      "Not provided"
                    )}
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-zinc-700">
                  <td className="font-medium p-2">Driving License</td>
                  <td className="p-2">
                    {kycData?.driving_license_number ? (
                      <span className="font-mono">{kycData.driving_license_number}</span>
                    ) : (
                      "Not provided"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-2">Voter ID</td>
                  <td className="p-2">
                    {kycData?.voter_id_number ? (
                      <span className="font-mono">{kycData.voter_id_number}</span>
                    ) : (
                      "Not provided"
                    )}
                  </td>
                </tr>

                {/* Banking Info Section */}
                <tr>
                  <td colSpan={2} className="p-2 pt-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Banking Information
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-zinc-700">
                  <td className="font-medium p-2">Bank Name</td>
                  <td className="p-2">{user.bank?.bankName || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-medium p-2">Account Number</td>
                  <td className="p-2">{user.bank?.accountNumber || "N/A"}</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-zinc-700">
                  <td className="font-medium p-2">IFSC Code</td>
                  <td className="p-2">{user.bank?.ifsc || "N/A"}</td>
                </tr>
                <tr>
                  <td className="font-medium p-2">UPI ID</td>
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
            
            {loadingKyc ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-sm text-gray-500">Loading KYC documents...</p>
              </div>
            ) : kycData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhaar Card */}
                <div className="border rounded-lg p-4 dark:border-zinc-600">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800 dark:text-white">Aadhaar Card</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded dark:bg-zinc-700">
                    {kycData.aadhaar_card_number ? (
                      <div>
                        <p className="font-mono text-sm break-all">{kycData.aadhaar_card_number}</p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(kycData.updatedAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
                
                {/* PAN Card */}
                <div className="border rounded-lg p-4 dark:border-zinc-600">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800 dark:text-white">PAN Card</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded dark:bg-zinc-700">
                    {kycData.pan_card_number ? (
                      <div>
                        <p className="font-mono text-sm break-all">{kycData.pan_card_number}</p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(kycData.updatedAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
                
                {/* Driving License */}
                <div className="border rounded-lg p-4 dark:border-zinc-600">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800 dark:text-white">Driving License</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded dark:bg-zinc-700">
                    {kycData.driving_license_number ? (
                      <div>
                        <p className="font-mono text-sm break-all">{kycData.driving_license_number}</p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(kycData.updatedAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
                
                {/* Voter ID */}
                <div className="border rounded-lg p-4 dark:border-zinc-600">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800 dark:text-white">Voter ID</h4>
                  </div>
                  <div className="bg-gray-50 p-3 rounded dark:bg-zinc-700">
                    {kycData.voter_id_number ? (
                      <div>
                        <p className="font-mono text-sm break-all">{kycData.voter_id_number}</p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(kycData.updatedAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-32">
                <p className="text-sm text-gray-500">No KYC documents found for this user.</p>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-semibold mb-3">KYC Status</h4>
              <div className="flex items-center">
                {kycData?.status ? (
                  renderDocumentStatus(kycData.status)
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white">
                    <Clock className="w-3 h-3" />
                    Not Available
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      // ... (other tabs remain unchanged)
      default:
        return (
          <div className="border rounded-lg p-4 mb-4 dark:border-zinc-700">
            <p className="text-gray-500">Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
      <button 
        onClick={onBack} 
        className="mb-6 flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Users
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            user.status === "Active"
              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
              : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
          }`}>
            {user.status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            kycData?.status === "verified" 
              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white" 
              : kycData?.status === "rejected" 
                ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white" 
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
          }`}>
            {kycData?.status ? kycData.status.charAt(0).toUpperCase() + kycData.status.slice(1) : "KYC Pending"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 border-b mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.name
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <>
          <div className="mb-4 text-right">
            <button
              onClick={handleExportPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Export as PDF
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
        </>
      )}
    </div>
  );

  
}