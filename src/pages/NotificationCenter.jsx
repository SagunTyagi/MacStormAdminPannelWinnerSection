import { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  RefreshCw,
  Edit,
  Send,
  Clock,
  Calendar,
} from "lucide-react";
import Modal from "../components/EditNotificationModal";
import dayjs from "dayjs";
import axios from "axios";
export default function NotificationCenter() {
  const pageSize = 5;

  const [tab, setTab] = useState("compose");
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [composeData, setComposeData] = useState({
    title: "",
    body: "",
    audience: "All Users",
    filters: "",
    deeplink: "",
    schedule: false,
    scheduledDate: "",
    scheduledTime: "",
  });

  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     title: "Tournament Reminder",
  //     status: "Delivered",
  //     audience: "Registered Users",
  //     sends: 12453,
  //     opens: 4231,
  //     ctr: "34%",
  //     sentAt: "2025-07-22 20:00",
  //   },
  //   {
  //     id: 2,
  //     title: "Match Results Published",
  //     status: "Failed",
  //     audience: "Participants",
  //     sends: 56,
  //     opens: 0,
  //     ctr: "0%",
  //     sentAt: "2025-07-21 15:45",
  //   },
  //   ...Array.from({ length: 99 }, (_, i) => {
  //     const scheduledDate = `2025-07-${String((i % 30) + 1).padStart(2, "0")}T08:00:00Z`;
  //     const sentAt = `2025-07-${String((i % 30) + 1).padStart(2, "0")}, ${(8 + (i % 12)).toString().padStart(2, "0")}:00:00`;

  //     return {
  //       id: `N${(i + 2).toString().padStart(3, "0")}`,
  //       title: `Generated Notification ${i + 2}`,
  //       body: `Auto-generated content ${i + 2}`,
  //       audience: ["All Users", "Premium Users", "State Players"][i % 3],
  //       status: ["Sent", "Scheduled", "Failed","Delivered"][i % 4],
  //       ctr: (Math.random() * 20).toFixed(2),
  //       opens: Math.floor(Math.random() * 5000),
  //       scheduled: scheduledDate,
  //       sentAt: sentAt,
  //     };
  //   })
  // ]);

  // Compose handlers

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(res.data.notifications || []); // Adjust this depending on your API response structure
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleComposeChange = (field, val) =>
    setComposeData((d) => ({ ...d, [field]: val }));

  // const handleSend = () => {
  //   alert("Notification sent/scheduled!");
  //   // Reset form
  //   setComposeData({
  //     title: "",
  //     body: "",
  //     audience: "All Users",
  //     filters: "",
  //     deeplink: "",
  //     schedule: false,
  //     scheduledDate: "",
  //     scheduledTime: "",
  //   });
  // };
  const handleSend = async () => {
    try {
      const payload = {
        ...composeData,
        scheduledAt: composeData.schedule
          ? `${composeData.scheduledDate}T${composeData.scheduledTime}`
          : null,
      };

      await axios.post("http://localhost:5000/api/notifications", payload);

      alert("Notification sent/scheduled!");
      refresh(); // Refresh history table
      setComposeData({
        title: "",
        body: "",
        audience: "All Users",
        filters: "",
        deeplink: "",
        schedule: false,
        scheduledDate: "",
        scheduledTime: "",
      });
    } catch (err) {
      console.error("Error sending notification", err);
      alert("Failed to send notification");
    }
  };

  // History handlers
  const filteredData = notifications
    .filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((n) => (filterStatus ? n.status === filterStatus : true));

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelectAll = () => {
    const ids = selectAll ? [] : pageData.map((n) => n.id);
    setSelected(ids);
    setSelectAll(!selectAll);
  };
  const toggleSelection = (id) =>
    selected.includes(id)
      ? setSelected(selected.filter((sid) => sid !== id))
      : setSelected([...selected, id]);

  const deleteSelected = () => {
    setNotifications(notifications.filter((n) => !selected.includes(n.id)));
    setSelected([]);
    setSelectAll(false);
  };

  const exportCSV = () => {
    const csv = [
      ["Title", "Status", "Audience", "Sends", "Opens", "CTR", "Sent At"],
      ...filteredData.map((n) => [
        n.title,
        n.status,
        n.audience,
        n.sends,
        n.opens,
        n.ctr,
        n.sentAt,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "notifications.csv";
    a.click();
  };

  // const refresh = () => alert("Data refreshed!");
  const refresh = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to refresh data", error);
    }
  };

  const openEdit = (notif) => {
    setEditingNotification(notif);
    setShowEdit(true);
  };
  const closeEdit = () => {
    setShowEdit(false);
    setEditingNotification(null);
  };
  const saveEdit = (updated) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
    closeEdit();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Center</h1>

      {/* Tabs */}
      <div className="flex mb-6 rounded bg-gray-100">
        {["compose", "history"].map((t) => (
          <button
            key={t}
            className={`flex-1 py-2 ${tab === t
              ? "bg-white shadow font-semibold"
              : "text-gray-600"
              }`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Compose */}
      {tab === "compose" && (
        <div className="bg-white shadow rounded p-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="font-medium">Notification Title</label>
            <input
              className="w-full border rounded p-2"
              placeholder="Enter notification title"
              value={composeData.title}
              onChange={(e) =>
                handleComposeChange("title", e.target.value)
              }
            />
            <label className="font-medium">Notification Body</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              placeholder="Write your notification content here..."
              value={composeData.body}
              onChange={(e) =>
                handleComposeChange("body", e.target.value)
              }
            />
            <label className="font-medium">Deeplink (optional)</label>
            <input
              className="w-full border rounded p-2"
              placeholder="app://match/123"
              value={composeData.deeplink}
              onChange={(e) =>
                handleComposeChange("deeplink", e.target.value)
              }
            />
          </div>

          <div className="space-y-4">
            <label className="font-medium">Audience</label>
            <select
              className="w-full border rounded p-2"
              value={composeData.audience}
              onChange={(e) =>
                handleComposeChange("audience", e.target.value)
              }
            >
              {[
                "All Users",
                "Registered Users",
                "Premium Users",
                "State Players",
                "National Players",
                "Custom Segment",
              ].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>

            <label className="font-medium">Custom Filters</label>
            <input
              className="w-full border rounded p-2"
              placeholder="Add filters like state, game type, etc."
              value={composeData.filters}
              onChange={(e) =>
                handleComposeChange("filters", e.target.value)
              }
            />

            <label className="font-medium">Delivery Options</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleComposeChange("schedule", !composeData.schedule)
                }
                className={`px-4 py-1 rounded ${composeData.schedule
                  ? "bg-black text-white"
                  : "bg-gray-200"
                  }`}
              >
                Scheduled
              </button>
              {composeData.schedule && (
                <>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2 text-gray-500" size={16} />
                    <input
                      type="date"
                      className="border rounded pl-8 p-2"
                      value={composeData.scheduledDate}
                      onChange={(e) =>
                        handleComposeChange("scheduledDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2 text-gray-500" size={16} />
                    <input
                      type="time"
                      className="border rounded pl-8 p-2"
                      value={composeData.scheduledTime}
                      onChange={(e) =>
                        handleComposeChange("scheduledTime", e.target.value)
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Rate limit: 100,000 notifications/min
              </span>
              <button
                onClick={handleSend}
                className="bg-black text-white px-4 py-2 flex items-center gap-2 rounded"
              >
                <Send size={16} /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by title"
              className="border px-3 py-2 rounded flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border px-3 py-2 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
              <option value="Sent">Sent</option>
              <option value="Scheduled">Scheduled</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={refresh}
                className="border px-4 py-2 rounded flex items-center gap-1"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              <button
                onClick={exportCSV}
                className="border px-4 py-2 rounded flex items-center gap-1"
              >
                <Download size={14} /> Export CSV
              </button>
              <button
                onClick={deleteSelected}
                disabled={!selected.length}
                className={`px-4 py-2 rounded flex items-center gap-1 ${selected.length
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-white cursor-not-allowed"
                  }`}
              >
                <Trash2 size={14} /> Delete Selected ({selected.length})
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Audience</th>
                  <th className="px-4 py-2">Sends</th>
                  <th className="px-4 py-2">Opens</th>
                  <th className="px-4 py-2">CTR</th>
                  <th className="px-4 py-2">Sent At</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((n) => (
                  <tr key={n.id} className="border-t">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(n.id)}
                        onChange={() => toggleSelection(n.id)}
                      />
                    </td>
                    <td className="px-4 py-2">{n.title}</td>
                    <td className="px-4 py-2">{n.status}</td>
                    <td className="px-4 py-2">{n.audience}</td>
                    <td className="px-4 py-2">{n.sends ?? "-"}</td>
                    <td className="px-4 py-2">{n.opens ?? "-"}</td>
                    <td className="px-4 py-2">{n.ctr ?? "-"}</td>
                    <td className="px-4 py-2">{dayjs(n.sentAt).format("YYYY-MM-DD HH:mm")}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-500 hover:underline flex items-center gap-1"
                        onClick={() => openEdit(n)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Pagination */}
          {/* Sliding Pagination with Prev/Next */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => {
                const newPage = Math.max(currentPage - 1, 1);
                setCurrentPage(newPage);
                setSelectAll(false);
                setSelected([]);
              }}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100"
                }`}
            >
              Prev
            </button>

            {Array.from({ length: 3 }, (_, i) => {
              const pageNumber = Math.min(
                Math.max(currentPage - 1 + i, 1),
                totalPages - 2 + i > totalPages ? totalPages : currentPage - 1 + i
              );

              // Ensure only valid pages shown
              if (pageNumber > totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => {
                    setCurrentPage(pageNumber);
                    setSelectAll(false);
                    setSelected([]);
                  }}
                  className={`px-3 py-1 rounded ${currentPage === pageNumber ? "bg-black text-white" : "bg-gray-100"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => {
                const newPage = Math.min(currentPage + 1, totalPages);
                setCurrentPage(newPage);
                setSelectAll(false);
                setSelected([]);
              }}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>


          {showEdit && editingNotification && (
            <Modal
              notification={editingNotification}
              onSave={saveEdit}
              onClose={closeEdit}
            />
          )}
        </div>
      )}
    </div>
  );
}
