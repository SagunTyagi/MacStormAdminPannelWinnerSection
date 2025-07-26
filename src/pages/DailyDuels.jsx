import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function DailyDuels() {
  const [tab, setTab] = useState("pending");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDuel, setSelectedDuel] = useState(null); 
  const [duels, setDuels] = useState({ pending: [], verified: [], webhooks: [] });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");


  useEffect(() => {
    axios.get("http://localhost:5000/api/duels")
      .then((res) => {
        const allDuels = res.data;
        console.log("Fetched duels:", allDuels);
        const pending = allDuels.filter((d) => d.status?.toLowerCase() === "pending");
        const verified = allDuels.filter((d) => d.status?.toLowerCase() === "verified");


        const webhooks = allDuels
          .filter(d => d.status === "Pending" || d.status === "Verified")
          .map((d, i) => ({
            duelId: i + 1,
            event: d.status === "Verified" ? "MATCH_END" : "MATCH_CREATED",
            winner: d.winner || "N/A",
            timestamp: d.completedAt || d.startTime
        }));

        setDuels({ pending, verified, webhooks }); // ✅ Not `completed`

      })
      .catch((err) => {
        console.error("Error fetching duels:", err);
      });
  }, []);




  
const renderSummaryStats = () => {
  const active = duels.pending.length;
  const completedToday = duels.verified.filter((d) =>
    new Date(d.startTime).toDateString() === new Date().toDateString()
  ).length;

  const earnings = duels.verified.reduce(
    (sum, d) => sum + d.entryFee * d.joinedPlayers,
    0
  );
  const pendingVerifications = duels.pending.filter((d) => d.status?.toLowerCase() === "pending").length;


  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow text-center">
        <p className="text-sm text-gray-500">Active Duels</p>
        <p className="text-2xl font-bold dark:text-white">{active}</p>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow text-center">
        <p className="text-sm text-gray-500">Completed Today</p>
        <p className="text-2xl font-bold text-green-600">{completedToday}</p>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow text-center">
        <p className="text-sm text-gray-500">Total Earnings</p>
        <p className="text-2xl font-bold dark:text-white">₹{earnings}</p>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow text-center">
        <p className="text-sm text-gray-500">Pending Verification</p>
        <p className="text-2xl font-bold text-yellow-500">{pendingVerifications}</p>
      </div>
    </div>
  );
};

const renderCard = (duel) => {
  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/duels/${duel.id}`, {
        status: "Verified",
      });
      const updatedDuel = res.data;
      setDuels((prev) => {
        const updatedPending = prev.pending.filter((d) => d.id !== updatedDuel.id);
        const updatedVerified = [...prev.verified, updatedDuel];
        return { ...prev, pending: updatedPending, verified: updatedVerified };
      });
      toast.success("Duel verified successfully!");
    } catch (err) {
      console.error("Failed to verify duel:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      key={duel.id}
      className="border-l-4 border-blue-600 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 w-1/2"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{duel.title}</h2>
        <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white">
          {duel.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Type:</strong> {duel.type}</p>
        <p><strong>Players:</strong> 👥 {duel.players}</p>
        <p><strong>Entry Fee:</strong> ₹{duel.entryFee}</p>
        <p><strong>Prize Pool:</strong> 🏆 ₹{duel.prizePool}</p>
        <p className="col-span-2">
          <strong>Start Time:</strong>{" "}
          {new Date(duel.startTime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </p>
        {duel.winner && (
          <p className="col-span-2">
            <strong>Winner:</strong> {duel.winner}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
          onClick={() => setSelectedDuel(duel)}
        >
          View Details
        </button>

        {duel.status === "Pending" && (
          <button
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleVerify}
          >
            Verify Result
          </button>
        )}
      </div>
    </div>
  );
};

  const renderWebhooksTable = () => (
    <div className="w-full overflow-x-auto px-2 sm:px-0">
      <div className="min-w-[700px]">
        <table className="w-full bg-white dark:bg-zinc-800 rounded-md shadow text-sm">
          <thead>
            <tr className="border-b dark:border-zinc-700 text-left">
              <th className="px-4 py-2 font-medium dark:text-white">Duel ID</th>
              <th className="px-4 py-2 font-medium dark:text-white">Event</th>
              <th className="px-4 py-2 font-medium dark:text-white">Winner</th>
              <th className="px-4 py-2 font-medium dark:text-white">Timestamp</th>
              <th className="px-4 py-2 font-medium dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {duels.webhooks.map((event, idx) => (
              <tr
                key={idx}
                className="border-b dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <td className="px-4 py-2 dark:text-white">{event.duelId}</td>
                <td className="px-4 py-2 dark:text-white">{event.event}</td>
                <td className="px-4 py-2 dark:text-white">{event.winner}</td>
                <td className="px-4 py-2 dark:text-white">
                  {new Date(event.timestamp).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    event.status === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {event.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


);
console.log("Tab:", tab);
console.log("Pending duels:", duels.pending);
console.log("Completed duels:", duels.verified);  

  return (
    <div className="p-6 min-h-screen">
      {/* Header + Button */}
    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Daily Duels
        </h1>
        <h5 className="text-sm text-gray-500 dark:text-gray-100 mt-1">
          Manage daily duel events and monitor results
        </h5>
      </div>

      <div className="flex items-center gap-4">
       
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-700"
        >
          + Create Duel
        </button>
      </div>
    </div>

        {renderSummaryStats()}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["pending", "verified", "webhooks"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${
              tab === t
                ? "bg-zinc-800 text-white"
                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white"
            }`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Status Messages */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Processing...</span>
        </div>
      )}

      {successMsg && (
        <p className="text-green-600 font-medium mb-2"> {successMsg}</p>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Cards or webhook table here */}
      </div>


      {/* Content */}
      <div className="space-y-4">
        {tab === "pending" &&
          duels.pending.map(renderCard)}

        {tab === "verified" &&
          [...duels.verified]
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
            .map(renderCard)}


        {tab === "webhooks" && renderWebhooksTable()}

      </div>

      {/* Create Duel Modal */}
       {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-200 ease-out">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold dark:text-gray-100">Create New Duel</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const form = e.target;
                  const newDuel = {
                    title: form.title.value,
                    entryFee: parseInt(form.entryFee.value),
                    prizePool: parseInt(form.prizePool.value),
                    type: form.type.value,
                    players: `0/${form.players.value}`,
                    joinedPlayers: 0, // ✅ Required for earnings
                    startTime: new Date(form.startTime.value).toISOString(),
                    status: "Pending",
                  };

                  try {
                    const res = await axios.post("http://localhost:5000/api/duels", newDuel);
                    const savedDuel = res.data;

                    setDuels((prev) => ({
                      ...prev,
                      pending: [...prev.pending, savedDuel],
                    }));

                    toast.success("✅ New duel created!");
                    setShowCreateModal(false);
                  } catch (err) {
                    console.error("Failed to create duel:", err);
                    toast.error("❌ Failed to create duel.");
                  } finally {
                    setLoading(false);
                  }
                }}




                className="space-y-4"
            >
                <div className="space-y-2">
                <label className="block text-sm font-medium dark:text-gray-100">Duel Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Enter duel title"
                    required
                    className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium dark:text-gray-100">Entry Fee (₹)</label>
                  <input
                    type="number"
                    name="entryFee"
                    required
                    className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-100">Max Players</label>
                    <input
                    type="number"
                    name="players"
                    required
                    className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700"
                    />
                </div>
                </div>

                <div className="space-y-2">
                <label className="block text-sm font-medium dark:text-gray-100">Prize Pool (₹)</label>
                <input
                    type="number"
                    name="prizePool"
                    required
                    className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700"
                />
                </div>

                <div className="space-y-2">
                <label className="block text-sm font-medium dark:text-gray-100">Game Type</label>
                <select
                    name="type"
                    className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700 dark:text-white"
                >
                    <option value="Solo">Solo</option>
                    <option value="Duo">Duo</option>
                    <option value="Squad">Squad</option>
                </select>
                </div>

                <div className="space-y-2">
                <label className="block text-sm font-medium dark:text-gray-100">Start Time</label>
                <input
                    type="datetime-local"
                    name="startTime"
                    required
                    className="w-full p-2 rounded bg-zinc-100 dark:bg-zinc-700"
                />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-zinc-300 dark:bg-zinc-600 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={`px-4 py-2 bg-black text-white rounded flex items-center justify-center gap-2 ${
                      loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-zinc-700'
                    }`}
                    disabled={loading}
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    )}
                    {loading ? "Creating..." : "Create Duel"}
                  </button>
                </div>

            </form>
            </div>
        </div>
        )}

      {/* View Details Modal */}
      {selectedDuel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-200 ease-out">
         <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-md space-y-4 transform transition-transform duration-300 scale-100">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Duel Details</h2>
            <div className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
              <p><strong>Title:</strong> {selectedDuel.title}</p>
              <p><strong>Type:</strong> {selectedDuel.type}</p>
              <p><strong>Players:</strong> {selectedDuel.players}</p>
              <p><strong>Entry Fee:</strong> ₹{selectedDuel.entryFee}</p>
              <p><strong>Prize Pool:</strong> ₹{selectedDuel.prizePool}</p>
              <p><strong>Status:</strong> {selectedDuel.status}</p>
              <p>
                <strong>Start Time:</strong>{" "}
                {new Date(selectedDuel.startTime).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              {selectedDuel.winner && <p><strong>Winner:</strong> {selectedDuel.winner}</p>}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setSelectedDuel(null)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
}



export default DailyDuels;
