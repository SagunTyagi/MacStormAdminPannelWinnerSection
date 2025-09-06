import React, { useState, useEffect } from "react";
import { Plus, Download, Search, Edit, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

// You can change this to your actual API base URL
const API_BASE_URL = "https://macstormbattle-backend-2.onrender.com/api";

// Custom Confirmation Modal component to replace window.confirm
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Confirm Action
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Team Modal
const EditTeamModal = ({ team, onClose, onSave }) => {
  const [name, setName] = useState(team.name);
  const [registrationAmount, setRegistrationAmount] = useState(
    team.registrationAmount
  );
  // Join the rules array into a single string for the textarea
  const [rules, setRules] = useState(
    (team.rules || [])
      .sort((a, b) => a.order - b.order)
      .map((r) => r.text)
      .join("\n")
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Split rules into array and filter out empty lines
    const updatedRules = rules
      .split("\n")
      .map(text => text.trim())
      .filter(text => text.length > 0);

    // Call the onSave prop with the correctly formatted data
    await onSave({
      ...team,
      name,
      registrationAmount,
      rules: updatedRules,
    });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Edit Team</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="registrationAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Registration Amount
            </label>
            <input
              type="text"
              id="registrationAmount"
              value={registrationAmount}
              onChange={(e) => setRegistrationAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="rules"
              className="block text-sm font-medium text-gray-700"
            >
              Rules (one per line)
            </label>
            <textarea
              id="rules"
              rows="4"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Teams Component
const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Utility function to normalize incoming rules data
  const normalizeRules = (rules) => {
    if (!Array.isArray(rules)) return [];
    return rules.map((r, i) => {
      // Handle cases where the data might be corrupted
      if (typeof r === "string") {
        return { text: r, order: i };
      }
      return {
        text: typeof r.text === "string" ? r.text : "",
        order: r.order ?? i,
      };
    });
  };

  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/teams`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const teamsData = Array.isArray(data) ? data : [data];

      setTeams(
        teamsData.map((team) => ({
          ...team,
          rules: normalizeRules(team.rules),
        }))
      );
    } catch (e) {
      console.error("Failed to fetch teams:", e);
      setError(
        "Failed to load teams. Please ensure the API is running and the URL is correct."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDeleteTeam = (id) => {
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/teams/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setTeams(teams.filter((team) => team.id !== id));
      } catch (e) {
        console.error("Failed to delete team:", e);
        setError("Failed to delete the team. Please try again.");
      } finally {
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setShowEditModal(true);
  };

const handleSaveTeam = async (updatedTeam) => {
  try {
    // Only send necessary fields to the API
    const payload = {
      id: updatedTeam.id,
      name: updatedTeam.name,
      registrationAmount: updatedTeam.registrationAmount,
      rules: updatedTeam.rules // Rules are already simple strings from EditTeamModal
    };

    const response = await fetch(`${API_BASE_URL}/admin/teams/${updatedTeam.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const savedTeam = await response.json();
    // Normalize the rules from the response for frontend display
    const normalizedTeam = {
      ...savedTeam,
      rules: savedTeam.rules.map(rule => {
        // If the rule is already an object with text property, use it as is
        if (typeof rule === 'object' && rule.text) {
          return rule;
        }
        // If it's a string, convert it to our expected format
        return {
          text: String(rule),
          order: savedTeam.rules.indexOf(rule)
        };
      })
    };
    
    setTeams(teams.map((t) => t.id === updatedTeam.id ? normalizedTeam : t));
    setShowEditModal(false);
  } catch (e) {
    console.error("Failed to save changes:", e);
    setError("Failed to save changes. Please check the API and try again.");
  }
};
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans antialiased text-gray-800">
      {showEditModal && selectedTeam && (
        <EditTeamModal
          team={selectedTeam}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveTeam}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this team?"
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Team Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage team details, registration, and rules
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md shadow-sm bg-white hover:bg-gray-100 text-gray-800 transition-colors duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export Teams
            </button>
            <Link to="/add-teams" className="flex items-center px-4 py-2 bg-black text-white text-sm rounded-md shadow-sm hover:bg-gray-800 transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200 gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Team Directory
            </h2>
            <div className="relative w-full md:w-64">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teams..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading teams...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : filteredTeams.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No teams found matching your search.
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-700 uppercase tracking-wider font-medium">
                    <tr>
                      <th className="px-6 py-3 text-left">Team ID</th>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">
                        Registration Amount
                      </th>
                      <th className="px-6 py-3 text-left">Registration Date</th>
                      <th className="px-6 py-3 text-left">Rules</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTeams.map((team) => (
                      <tr
                        key={team.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]">
                          {team.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={
                                team.imageUrl ||
                                `https://placehold.co/40x40/f0f0f0/888888?text=${team.name
                                  .charAt(0)
                                  .toUpperCase()}`
                              }
                              alt="Team avatar"
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/40x40/f0f0f0/888888?text=${team.name
                                  .charAt(0)
                                  .toUpperCase()}`;
                              }}
                            />
                            <span className="ml-3 font-medium text-gray-900">
                              {team.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {team.registrationAmount}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(
                            team.lastRegistrationDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {team.rules.length > 0
                            ? `${team.rules[0]?.text || ""}...`
                            : "No rules"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              className="text-gray-500 hover:text-green-600 transition-colors duration-200"
                              onClick={() => handleEditTeam(team)}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                              onClick={() => handleDeleteTeam(team.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block sm:hidden p-4 space-y-4">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          team.imageUrl ||
                          `https://placehold.co/40x40/f0f0f0/888888?text=${team.name
                            .charAt(0)
                            .toUpperCase()}`
                        }
                        alt="Team avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/40x40/f0f0f0/888888?text=${team.name
                            .charAt(0)
                            .toUpperCase()}`;
                        }}
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">
                          {team.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {team.registrationAmount
                            ? `$${team.registrationAmount}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>Team ID:</strong>{" "}
                        <span className="truncate max-w-[150px] inline-block">
                          {team.id}
                        </span>
                      </p>
                      <p>
                        <strong>Reg. Date:</strong>{" "}
                        {new Date(
                          team.lastRegistrationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="flex-1 text-center px-2 py-1 bg-green-500 text-white rounded text-xs transition-colors duration-200 hover:bg-green-600"
                      >
                        <Edit size={14} className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="flex-1 text-center px-2 py-1 bg-red-500 text-white rounded text-xs transition-colors duration-200 hover:bg-red-600"
                      >
                        <Trash2 size={14} className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
