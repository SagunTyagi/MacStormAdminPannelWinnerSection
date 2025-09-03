import { useState, useMemo } from "react"
import { Edit, Trash2, Plus, Download, Search, Save, X, Eye, TrendingUp, Users, Trophy, Gamepad2 } from "lucide-react"

// Initial gaming data
const initialGamingData = [
  { id: 1, gameName: "PUBG", teamName: "Team Liquid", username: "CoreJJ", level: 87 },
  { id: 2, gameName: "FreeFire", teamName: "FaZe Clan", username: "karrigan", level: 92 },
  { id: 3, gameName: "Valorant", teamName: "Sentinels", username: "TenZ", level: 95 },
  { id: 4, gameName: "PUBG", teamName: "Team Spirit", username: "TORONTOTOKYO", level: 88 },
  { id: 5, gameName: "PUBG", teamName: "San Francisco Shock", username: "proper", level: 91 },
  { id: 6, gameName: "FreeFire", teamName: "TSM", username: "ImperialHal", level: 89 },
  { id: 7, gameName: "PUBG", teamName: "G2 Esports", username: "JKnaps", level: 93 },
  { id: 8, gameName: "FreeFire", teamName: "NRG", username: "Clix", level: 86 },
  { id: 9, gameName: "FreeFire", teamName: "OpTic Gaming", username: "Scump", level: 90 },
  { id: 10, gameName: "PUBG", teamName: "Team BDS", username: "Shaiiko", level: 94 },
  { id: 11, gameName: "FreeFire", teamName: "Red Bull", username: "Daigo", level: 85 },
  { id: 12, gameName: "FreeFire", teamName: "KNEE Gaming", username: "KNEE", level: 92 },
  { id: 13, gameName: "PUBG", teamName: "Fnatic", username: "Tekkz", level: 88 },
  { id: 14, gameName: "FreeFire", teamName: "Team Liquid", username: "Thijs", level: 87 },
  { id: 15, gameName: "FreeFire", teamName: "Team Liquid", username: "Clem", level: 96 },
]

export default function EnhancedGamingTable() {
  const [gamingData, setGamingData] = useState(initialGamingData)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({ gameName: "", teamName: "", username: "", level: "" })
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })

  const filteredData = useMemo(() => {
    return gamingData.filter(
      (item) =>
        item.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.level.toString().includes(searchTerm),
    )
  }, [gamingData, searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, page, rowsPerPage])

  const statsData = useMemo(() => {
    const totalPlayers = gamingData.length
    const avgLevel = Math.round(gamingData.reduce((sum, player) => sum + player.level, 0) / totalPlayers)
    const topLevel = Math.max(...gamingData.map(player => player.level))
    const uniqueGames = new Set(gamingData.map(player => player.gameName)).size
    
    return { totalPlayers, avgLevel, topLevel, uniqueGames }
  }, [gamingData])

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000)
  }

  const exportToCSV = () => {
    const headers = ["Game Name", "Team Name", "InGame Username", "InGame Level"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) => `"${row.gameName}","${row.teamName}","${row.username}",${row.level}`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "gaming_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification("Data exported successfully!")
  }

  const handleEdit = (id) => {
    const item = gamingData.find(item => item.id === id)
    setEditingId(id)
    setEditValues(item)
  }

  const handleSave = (id) => {
    if (!editValues.gameName || !editValues.teamName || !editValues.username || !editValues.level) {
      showNotification("All fields are required!", "error")
      return
    }

    if (isNaN(editValues.level) || editValues.level < 1 || editValues.level > 100) {
      showNotification("Level must be a number between 1 and 100!", "error")
      return
    }

    setGamingData(prev => prev.map(item => 
      item.id === id ? { ...editValues, level: Number(editValues.level) } : item
    ))
    setEditingId(null)
    setEditValues({})
    showNotification("Entry updated successfully!")
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleDelete = (id) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setGamingData(prev => prev.filter(item => item.id !== deleteId))
    setDeleteDialogOpen(false)
    setDeleteId(null)
    showNotification("Entry deleted successfully!", "warning")
  }

  const handleCreate = () => {
    if (!newEntry.gameName || !newEntry.teamName || !newEntry.username || !newEntry.level) {
      showNotification("All fields are required!", "error")
      return
    }

    if (isNaN(newEntry.level) || newEntry.level < 1 || newEntry.level > 100) {
      showNotification("Level must be a number between 1 and 100!", "error")
      return
    }

    const newId = Math.max(...gamingData.map(item => item.id)) + 1
    const newPlayer = {
      id: newId,
      gameName: newEntry.gameName,
      teamName: newEntry.teamName,
      username: newEntry.username,
      level: Number(newEntry.level)
    }

    setGamingData(prev => [...prev, newPlayer])
    setCreateDialogOpen(false)
    setNewEntry({ gameName: "", teamName: "", username: "", level: "" })
    showNotification("New entry created successfully!")
  }

  const getLevelBadge = (level) => {
    if (level >= 95) return { color: "bg-red-100 text-red-800 border-red-200", label: "Elite" }
    if (level >= 90) return { color: "bg-green-100 text-green-800 border-green-200", label: "Pro" }
    if (level >= 85) return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Advanced" }
    return { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Intermediate" }
  }

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Gaming Data Management
          </h1>
          <p className="text-gray-600 mb-6">
            Comprehensive gaming team data with advanced management capabilities
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-600 from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.totalPlayers}</p>
                  <p className="text-blue-100 text-sm">Total Players</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gray-600 from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.avgLevel}</p>
                  <p className="text-green-100 text-sm">Avg Level</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gray-600 from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.topLevel}</p>
                  <p className="text-purple-100 text-sm">Top Level</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gray-600 from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.uniqueGames}</p>
                  <p className="text-orange-100 text-sm">Unique Games</p>
                </div>
                <Gamepad2 className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by game, team, username, or level..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(0)
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setPage(0)
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-black from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="px-6 py-3 bg-black from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Eye className="h-4 w-4" />
            Showing {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} entries
            {searchTerm && ` (filtered from ${gamingData.length} total)`}
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Game</th>
                  <th className="px-6 py-4 text-left font-semibold">Team</th>
                  <th className="px-6 py-4 text-left font-semibold">Username</th>
                  <th className="px-6 py-4 text-center font-semibold">Level</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => {
                  const isEditing = editingId === row.id
                  const levelBadge = getLevelBadge(row.level)
                  
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.gameName || ""}
                            onChange={(e) => setEditValues(prev => ({ ...prev, gameName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {row.gameName}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.teamName || ""}
                            onChange={(e) => setEditValues(prev => ({ ...prev, teamName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{row.teamName}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.username || ""}
                            onChange={(e) => setEditValues(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <span className="font-mono text-blue-600 font-semibold">@{row.username}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={editValues.level || ""}
                            onChange={(e) => setEditValues(prev => ({ ...prev, level: e.target.value }))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                          />
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${levelBadge.color}`}>
                              {row.level} - {levelBadge.label}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSave(row.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel editing"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(row.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit entry"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl mt-8">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or create a new entry</p>
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Entry
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Entry Modal */}
      {createDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Create New Player Entry</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Game Name</label>
                  <input
                    type="text"
                    value={newEntry.gameName}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, gameName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={newEntry.teamName}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={newEntry.username}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newEntry.level}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCreateDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-xl shadow-lg text-white ${
            notification.type === "success" ? "bg-green-500" :
            notification.type === "error" ? "bg-red-500" :
            "bg-orange-500"
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === "success" && <TrendingUp className="h-5 w-5" />}
                {notification.type === "error" && <X className="h-5 w-5" />}
                {notification.type === "warning" && <Trash2 className="h-5 w-5" />}
              </div>
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}