import React, { useState } from "react";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DEFAULT_WINNERS = [100];

export default function DuoContestForm() {
  const [eventName, setEventName] = useState("");
  const [totalWinners, setTotalWinners] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [fee, setFee] = useState("");
  const [game, setGame] = useState("BGMI");
  const [map, setMap] = useState("Erangel");
  const [schedule, setSchedule] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [prizeDesc, setPrizeDesc] = useState("");
  const [matchPrivateDesc, setMatchPrivateDesc] = useState("");
  const [winners, setWinners] = useState(
    DEFAULT_WINNERS.map((p, i) => ({ id: Date.now() + i, percent: p }))
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const totalPercent = winners.reduce((s, w) => s + Number(w.percent || 0), 0);

  // Update winners array based on total winners count
  const updateWinnersCount = (count) => {
    const numCount = parseInt(count) || 0;
    if (numCount === winners.length) return; // No change needed

    if (numCount > winners.length) {
      // Add more winner fields
      const newWinners = [...winners];
      for (let i = winners.length; i < numCount; i++) {
        newWinners.push({ id: Date.now() + i, percent: "" });
      }
      setWinners(newWinners);
    } else if (numCount < winners.length && numCount > 0) {
      // Remove excess winner fields
      setWinners(winners.slice(0, numCount));
    } else if (numCount === 0) {
      // Clear all winners
      setWinners([]);
    }
  };

  // helper to update a winner's percent
  const updateWinner = (index, value) => {
    const v = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
    setWinners((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], percent: v };
      return copy;
    });
  };

  const addWinner = () => {
    setWinners((prev) => [...prev, { id: Date.now(), percent: "" }]);
    setTotalWinners(String(winners.length + 1));
  };

  const removeWinner = (index) => {
    setWinners((prev) => prev.filter((_, i) => i !== index));
    setTotalWinners(String(Math.max(0, winners.length - 1)));
  };

  const validate = () => {
    const e = {};
    if (!eventName.trim()) e.eventName = "Event name required";
    if (!totalWinners.trim()) e.totalWinners = "Total winners required";
    if (isNaN(totalWinners) || Number(totalWinners) <= 0)
      e.totalWinners = "Total winners must be a positive number";

    if (!roomSize.trim()) e.roomSize = "Room size required";
    if (isNaN(roomSize) || Number(roomSize) <= 0)
      e.roomSize = "Room size must be a positive number";
    
    if (!fee || Number(fee) <= 0) e.fee = "Joining fee must be > 0";
    if (!schedule) e.schedule = "Match schedule required";
    if (winners.length === 0) e.winners = "At least one winner required";
    if (totalPercent !== 100) e.total = "Prize distribution total must be 100%";
    
    winners.forEach((w, i) => {
      if (w.percent === "" || isNaN(w.percent)) e[`w_${i}`] = "Enter a number";
      else if (w.percent < 0 || w.percent > 100)
        e[`w_${i}`] = "Value must be between 0 and 100";
    });
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createDistributionObject = () => {
    const distribution = {};
    winners.forEach((winner, index) => {
      distribution[String(index + 1)] = Number(winner.percent);
    });
    return distribution;
  };

  const formatScheduleForAPI = (scheduleString) => {
    // Convert local datetime to ISO string
    const date = new Date(scheduleString);
    return date.toISOString();
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Create payload in the required API format
      const payload = {
        event_name: eventName,
        room_size: Number(roomSize),
        joining_fee: Number(fee),
        total_winners: Number(totalWinners),
        distribution: createDistributionObject(),
        match_schedule: formatScheduleForAPI(schedule),
        game: game,
        team: "DUO", // Fixed value for duo contests
        map: map.toUpperCase(), // API expects uppercase
        banner_image_url: bannerUrl || null,
        prize_description: prizeDesc || null,
        match_sponsor: sponsor || null,
        match_description: description || null,
        match_private_description: matchPrivateDesc || null
      };

      console.log("Submitting payload:", payload);

      const response = await fetch("https://macstormbattle-backend.onrender.com/api/duo-contests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU0OTgxNDk5LCJleHAiOjE3NTYyNzc0OTl9.xPlZ7KmQNNYAux0BzumgoQ1GI3ESdvgMDXMfRx6F53Q",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Contest created successfully:", result);

      // Show success message
      toast.success("Contest created successfully!");

      // Reset form
      setEventName("");
      setTotalWinners("");
      setRoomSize("");
      setFee("");
      setGame("BGMI");
      setMap("Erangel");
      setSchedule("");
      setBannerUrl("");
      setDescription("");
      setSponsor("");
      setPrizeDesc("");
      setMatchPrivateDesc("");
      setWinners(DEFAULT_WINNERS.map((p, i) => ({ id: Date.now() + i, percent: p })));
      setErrors({});

      // Navigate back to duo contests page
      navigate("/duoContests");

    } catch (error) {
      console.error("Error creating contest:", error);
      toast.error(`Failed to create contest: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            type="button"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => window.history.back()}
            aria-label="Back to contests"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to contests
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Duo Contest</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.eventName ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="e.g., Duo Championship"
                  disabled={isSubmitting}
                />
                {errors.eventName && <p className="text-xs text-red-600 mt-1">{errors.eventName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Fee (₹) *</label>
                <input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  type="number"
                  min={1}
                  step={1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.fee ? "border-red-400" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.fee && <p className="text-xs text-red-600 mt-1">{errors.fee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game *</label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isSubmitting}
                >
                  <option>BGMI</option>
                  <option>PUBG</option>
                  <option>Free Fire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Map *</label>
                <select
                  value={map}
                  onChange={(e) => setMap(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isSubmitting}
                >
                  <option>Erangel</option>
                  <option>Sanhok</option>
                  <option>Miramar</option>
                  <option>Vikendi</option>
                </select>
              </div>
            </div>

                        {/* Room size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Size *</label>
              <input
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
                type="number"
                min={1}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.roomSize ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="e.g. 10"
                disabled={isSubmitting}
              />
              {errors.roomSize && <p className="text-xs text-red-600 mt-1">{errors.roomSize}</p>}
            </div>

            {/* Total winners */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Winners *</label>
              <input
                value={totalWinners}
                onChange={(e) => {
                  setTotalWinners(e.target.value);
                  updateWinnersCount(e.target.value);
                }}
                type="number"
                min={1}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.totalWinners ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="e.g. 2"
                disabled={isSubmitting}
              />
              {errors.totalWinners && <p className="text-xs text-red-600 mt-1">{errors.totalWinners}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Match Schedule *</label>
              <input
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                type="datetime-local"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.schedule ? "border-red-400" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.schedule && <p className="text-xs text-red-600 mt-1">{errors.schedule}</p>}
            </div>

            {/* Prize Distribution */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Prize Distribution</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {winners.length} winner{winners.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {winners.length > 0 ? (
                <div className="space-y-3">
                  {winners.map((w, i) => (
                    <div key={w.id} className="flex items-center space-x-4">
                      <div className="w-12 h-10 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center text-sm font-medium">
                        #{i + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          value={w.percent}
                          onChange={(e) => updateWinner(i, e.target.value)}
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                            errors[`w_${i}`] ? "border-red-400" : "border-gray-300"
                          }`}
                          placeholder={`Percentage for rank ${i + 1}`}
                          disabled={isSubmitting}
                        />
                        {errors[`w_${i}`] && <p className="text-xs text-red-600 mt-1">{errors[`w_${i}`]}</p>}
                      </div>
                      <span className="text-sm text-gray-500 w-8">%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter total winners above to configure prize distribution</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className={`text-sm font-medium ${totalPercent === 100 ? "text-green-600" : "text-red-600"}`}>
                  Total: {totalPercent}% {totalPercent !== 100 && "(must be 100%)"}
                </div>
                {errors.total && <div className="text-xs text-red-600">{errors.total}</div>}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information (Optional)</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                <input
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com/banner.jpg"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Describe your contest..."
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Private Description</label>
                <textarea
                  value={matchPrivateDesc}
                  onChange={(e) => setMatchPrivateDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={2}
                  placeholder="Private details like room codes, special instructions..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor</label>
                  <input
                    value={sponsor}
                    onChange={(e) => setSponsor(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Sponsor name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prize Description</label>
                  <input
                    value={prizeDesc}
                    onChange={(e) => setPrizeDesc(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Top 5 teams win"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={totalPercent !== 100 || isSubmitting}
              >
                {isSubmitting ? "Creating Contest..." : "Create Contest"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}