import React from 'react';

const GameplayStatistics = ({ user }) => {
  // Mock gameplay data for demonstration.
  // In a real application, this would be fetched from the user prop or an API.
  const gameplayStats = {
    totalMatches: 45,
    wins: 32,
    avgKills: 8.5,
    winRate: 71.1,
    currentTeams: ['Phoenix Warriors'],
    favoriteGame: 'Mobile Legends',
    totalEarnings: 2450.50,
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Gameplay Statistics</h3>
      <p className="text-sm text-gray-600 mb-6">Data joined from match_lineups, player_stats</p>

      {/* Stats Cards - Made more prominent */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:-translate-y-1">
          <p className="text-3xl font-bold text-gray-900">{gameplayStats.totalMatches}</p>
          <p className="text-sm text-gray-500">Total Matches</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:-translate-y-1">
          <p className="text-3xl font-bold text-green-600">{gameplayStats.wins}</p>
          <p className="text-sm text-gray-500">Wins</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:-translate-y-1">
          <p className="text-3xl font-bold text-blue-600">{gameplayStats.avgKills}</p>
          <p className="text-sm text-gray-500">Avg Kills</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 transform hover:-translate-y-1">
          <p className="text-3xl font-bold text-purple-600">{gameplayStats.winRate}%</p>
          <p className="text-sm text-gray-500">Win Rate</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Current Team(s)</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {gameplayStats.currentTeams.map((team, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {team}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Favorite Game</p>
            <p className="font-medium text-gray-900">{gameplayStats.favoriteGame}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="font-medium text-green-600">${gameplayStats.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameplayStatistics;
