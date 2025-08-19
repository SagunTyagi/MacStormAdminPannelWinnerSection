import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const DEFAULT_WINNERS = [100];

export default function SquadContestForm() {
  const [eventName, setEventName] = useState("");
  const [fee, setFee] = useState("");
  const [game, setGame] = useState("BGMI");
  const [map, setMap] = useState("Erangel");
  const [schedule, setSchedule] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [totalWinners, setTotalWinners] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [prizeDesc, setPrizeDesc] = useState("");
    const [winners, setWinners] = useState(
    DEFAULT_WINNERS.map((p, i) => ({ id: Date.now() + i, percent: p }))
  );

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const totalPercent = winners.reduce((s, w) => s + Number(w.percent || 0), 0);

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
    setWinners((prev) => [...prev, { id: Date.now(), percent: 0 }]);
  };

  const removeWinner = (index) => {
    setWinners((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!eventName.trim()) e.eventName = "Event name required";
    if (!fee || Number(fee) <= 0) e.fee = "Joining fee must be > 0";
    if (!schedule) e.schedule = "Match schedule required";
    if (!roomSize || Number(roomSize) < 8 || Number(roomSize) > 100)
      e.roomSize = "Room size must be between 8 and 100";
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

    // ✅ Auto-generate winners array when totalWinners changes
  useEffect(() => {
    const count = Number(totalWinners);
    if (!count || count <= 0) return;

    setWinners((prev) => {
      const newArr = [];
      for (let i = 0; i < count; i++) {
        newArr.push({
          id: prev[i]?.id || Date.now() + i,
          percent: prev[i]?.percent || 0,
        });
      }
      return newArr;
    });
  }, [totalWinners]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      event_name: eventName,
      room_size: Number(roomSize), // you can make this dynamic if needed
      joining_fee: Number(fee),
      total_winners: winners.length,
      distribution: winners.reduce((acc, w, idx) => {
        acc[idx + 1] = Number(w.percent);
        return acc;
      }, {}),
      match_schedule: new Date(schedule).toISOString(), // convert datetime-local to ISO
      game,
      team: "SQUAD", // fixed or dynamic based on UI
      map: map.toUpperCase(),
      banner_image_url: bannerUrl || null,
      prize_description: prizeDesc,
      match_sponsor: sponsor,
      match_description: description,
      match_private_description: "Be on time", // can make optional
    };

    try {
      await axiosInstance.post("/squid-contests/create", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Contest created successfully!");
      // reset form
      setEventName("");
      setFee("");
      setGame("BGMI");
      setMap("Erangel");
      setSchedule("");
      setRoomSize("");
      setTotalWinners("");
      setBannerUrl("");
      setDescription("");
      setSponsor("");
      setPrizeDesc("");
      setWinners(
        DEFAULT_WINNERS.map((p, i) => ({ id: Date.now() + i, percent: p }))
      );
      setErrors({});
      navigate("/squad");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create contest");
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create Squad Contest
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.eventName ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="e.g., Squad Championship"
                />
                {errors.eventName && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.eventName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Fee (₹) *
                </label>
                <input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  type="number"
                  min={1}
                  step={1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.fee ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.fee && (
                  <p className="text-xs text-red-600 mt-1">{errors.fee}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game *
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option>BGMI</option>
                  <option>PUBG</option>
                  <option>Free Fire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Map *
                </label>
                <select
                  value={map}
                  onChange={(e) => setMap(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option>Erangel</option>
                  <option>Sanhok</option>
                  <option>Miramar</option>
                  <option>Vikendi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Size *
              </label>
              <input
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
                type="number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.roomSize ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="No. of players (Max 100)"
              />
              {errors.roomSize && (
                <p className="text-xs text-red-600 mt-1">{errors.roomSize}</p>
              )}
            </div>

             <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Winners *
        </label>
        <input
          value={totalWinners}
          onChange={(e) => setTotalWinners(e.target.value)}
          type="number"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
            errors.totalWinners ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Number of winners"
        />
        {errors.totalWinners && (
          <p className="text-xs text-red-600 mt-1">{errors.totalWinners}</p>
        )}
      </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Schedule *
              </label>
              <input
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                type="datetime-local"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.schedule ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.schedule && (
                <p className="text-xs text-red-600 mt-1">{errors.schedule}</p>
              )}
            </div>

            {/* Prize Distribution */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Prize Distribution
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => removeWinner(winners.length - 1)}
                    disabled={winners.length <= 1}
                    title="Remove last winner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-sm text-gray-600">
                    {winners.length} winners
                  </span>

                  <button
                    type="button"
                    className="p-1 text-green-600 hover:text-green-800"
                    onClick={addWinner}
                    title="Add winner"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {winners.map((w, i) => (
                  <div key={w.id} className="flex items-center space-x-4">
                    <div className="w-12 h-10 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        value={w.percent}
                        onChange={(e) => updateWinner(i, e.target.value)}
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors[`w_${i}`]
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="Percentage"
                      />
                      {errors[`w_${i}`] && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors[`w_${i}`]}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 w-8">%</span>
                    <button
                      type="button"
                      onClick={() => removeWinner(i)}
                      disabled={winners.length <= 1}
                      className="p-1 text-red-600 hover:text-red-800"
                      title={`Remove winner ${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div
                  className={`text-sm font-medium ${
                    totalPercent === 100 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Total: {totalPercent}%{" "}
                  {totalPercent !== 100 && "(must be 100%)"}
                </div>
                {errors.total && (
                  <div className="text-xs text-red-600">{errors.total}</div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Additional Information (Optional)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Match Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Describe your contest..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor
                  </label>
                  <input
                    value={sponsor}
                    onChange={(e) => setSponsor(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Sponsor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prize Description
                  </label>
                  <input
                    value={prizeDesc}
                    onChange={(e) => setPrizeDesc(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Top 5 teams win"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={totalPercent !== 100}
              >
                Create Contest
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
