import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Gamepad2, CreditCard, FileText, TrendingUp, Activity, BarChart3, Target, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  
  // Token from localStorage
  const authToken = localStorage.getItem("authToken");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };
      const [
        usersRes,
        tournamentsRes,
        reportsRes,
        teamsRes,
        subscriptionsRes
      ] = await Promise.all([
        fetch('https://macstormbattle-backend-2.onrender.com/api/auth/user', { headers }),
        fetch('https://macstormbattle-backend-2.onrender.com/api/tournament', { headers }),
        fetch('https://macstormbattle-backend.onrender.com/api/reports/reports', { headers }),
        fetch('https://macstormbattle-backend-2.onrender.com/api/admin/teams', { headers }),
        fetch('https://macstormbattle-backend-2.onrender.com/api/subscriptions', { headers })
      ]);
      if (!usersRes.ok) throw new Error(`Users API error: ${usersRes.status}`);
      if (!tournamentsRes.ok) throw new Error(`Tournaments API error: ${tournamentsRes.status}`);
      if (!reportsRes.ok) throw new Error(`Reports API error: ${reportsRes.status}`);
      if (!teamsRes.ok) throw new Error(`Teams API error: ${teamsRes.status}`);
      if (!subscriptionsRes.ok) throw new Error(`Subscriptions API error: ${subscriptionsRes.status}`);

      const usersData = await usersRes.json();
      const tournamentsData = await tournamentsRes.json();
      const reportsData = await reportsRes.json();
      const teamsData = await teamsRes.json();
      const subscriptionsData = await subscriptionsRes.json();

      // For flexible response shapes
      const extractArray = (data, keys = ['users', 'data', 'subscriptions']) =>
        Array.isArray(data)
          ? data
          : keys.reduce(
              (acc, key) => (Array.isArray(data[key]) ? data[key] : acc),
              []
            );

      setUsers(extractArray(usersData, ['users', 'data']));
      setTournaments(Array.isArray(tournamentsData) ? tournamentsData : (tournamentsData.data || []));
      setReports(Array.isArray(reportsData) ? reportsData : (reportsData.data || []));
      setTeams(Array.isArray(teamsData) ? teamsData : (teamsData.data || []));
      setSubscriptions(extractArray(subscriptionsData, ['subscriptions', 'data']));

      // Chart data for last 30 days
      const chartDataArray = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');

        const usersOnDate = extractArray(usersData, ['users', 'data']).filter(
          user => user.createdAt && format(parseISO(user.createdAt), 'yyyy-MM-dd') === dateStr
        ).length;

        const registrationsOnDate = Array.isArray(tournamentsData) ? tournamentsData : (tournamentsData.data || []);

        const tournamentsCount = registrationsOnDate.filter(
          tournament => tournament.createdAt && format(parseISO(tournament.createdAt), 'yyyy-MM-dd') === dateStr
        ).length;

        const subscriptionsOnDate = extractArray(subscriptionsData, ['subscriptions', 'data']).filter(
          sub => sub.createdAt && format(parseISO(sub.createdAt), 'yyyy-MM-dd') === dateStr
        ).length;

        chartDataArray.push({
          date: format(date, 'MMM dd'),
          fullDate: dateStr,
          users: usersOnDate,
          registrations: tournamentsCount,
          subscriptions: subscriptionsOnDate
        });
      }

      setChartData(chartDataArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  const getRecentSubscriptions = () => subscriptions
    .filter(s => s.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="flex items-center" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 font-medium text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MacStorm Analytics
            </h1>
            <p className="text-gray-600 mt-2">Real-time insights into your gaming platform</p>
          </div>
          <button 
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{formatNumber(users.length)}</h3>
              <p className="text-gray-600 text-sm mt-1">Total Users</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{formatNumber(tournaments.length)}</h3>
              <p className="text-gray-600 text-sm mt-1">Tournament Registrations</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{formatNumber(subscriptions.length)}</h3>
              <p className="text-gray-600 text-sm mt-1">Active Subscriptions</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">{formatNumber(reports.length)}</h3>
              <p className="text-gray-600 text-sm mt-1">Generated Reports</p>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white/70 rounded-2xl shadow-lg border p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Platform Growth Analytics</h3>
              <p className="text-gray-600 mt-1">Track registrations and subscriptions over the last 30 days</p>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" name="New Users" />
                <Line type="monotone" dataKey="registrations" stroke="#10B981" name="Registrations" />
                <Line type="monotone" dataKey="subscriptions" stroke="#8B5CF6" name="Subscriptions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-gray-600 text-sm mt-1">Latest tournament registrations and subscriptions</p>
              </div>
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {tournaments.length > 0 ? (
                tournaments
                  .filter(t => t.createdAt)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map(tournament => (
                    <div key={tournament._id || tournament.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50/50 transition-all duration-200 border border-transparent hover:border-blue-200">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {tournament.formData?.teamName || 'Unnamed Team'}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Game: {tournament.formData?.game || 'Unknown'}
                        </p>
                        <p className="text-blue-600 text-xs font-medium">
                          Player: {tournament.formData?.inGameUsername || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {tournament.createdAt ? format(parseISO(tournament.createdAt), 'MMM dd, yyyy') : 'Unknown date'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {tournament.createdAt ? format(parseISO(tournament.createdAt), 'HH:mm') : 'Unknown time'}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          tournament.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : tournament.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tournament.status || 'unknown'}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent tournament registrations</p>
                </div>
              )}

              {getRecentSubscriptions().length > 0 ? (
                getRecentSubscriptions().map(subscription => (
                  <div key={subscription._id || subscription.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-purple-50/50 transition-all duration-200 border border-transparent hover:border-purple-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{subscription.planName || subscription.plan || 'Unknown'} Plan | ₹{subscription.price || 'N/A'}</p>
                      <p className="text-purple-600 text-xs font-medium">
                        New subscription activated
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{subscription.createdAt ? format(parseISO(subscription.createdAt), 'MMM dd, yyyy') : 'Unknown date'}</p>
                      <p className="text-xs text-gray-500">{subscription.createdAt ? format(parseISO(subscription.createdAt), 'HH:mm') : 'Unknown time'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent subscription activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Teams Overview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Teams Overview</h3>
                <p className="text-gray-600 text-sm mt-1">Active teams and members</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">{teams.length} Active</span>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {teams.length > 0 ? (
                teams.map(team => (
                  <div key={team._id || team.id} className="p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{team.name || 'Unnamed Team'}</h4>
                      <span className="text-sm font-medium text-emerald-600">{team.members?.length || 0} members</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{team.createdAt ? `Created ${format(parseISO(team.createdAt), 'MMM dd, yyyy')}` : 'Creation date unknown'}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(team.members?.length || 0, 4))].map((_, i) => (
                          <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{i + 1}</span>
                          </div>
                        ))}
                        {(team.members?.length || 0) > 4 && (
                          <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-medium">+{(team.members?.length || 0) - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No teams available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tournament Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tournament Analytics</h3>
                <p className="text-gray-600 text-sm mt-1">Registration trends and performance</p>
              </div>
              <Gamepad2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <div>
                  <p className="text-emerald-700 font-medium">Total Tournaments</p>
                  <p className="text-2xl font-bold text-emerald-900">{formatNumber(tournaments.length)}</p>
                </div>
                <div className="text-emerald-600">
                  <Target className="w-8 h-8" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">This Week</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tournaments.filter(t => t.createdAt && new Date(t.createdAt) > subDays(new Date(), 7)).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">This Month</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tournaments.filter(t => t.createdAt && new Date(t.createdAt) > subDays(new Date(), 30)).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Analytics */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Reports Analytics</h3>
                <p className="text-gray-600 text-sm mt-1">Generated reports and insights</p>
              </div>
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                <div>
                  <p className="text-amber-700 font-medium">Total Reports</p>
                  <p className="text-2xl font-bold text-amber-900">{formatNumber(reports.length)}</p>
                </div>
                <div className="text-amber-600">
                  <BarChart3 className="w-8 h-8" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">Recent</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {reports.filter(r => r.createdAt && new Date(r.createdAt) > subDays(new Date(), 7)).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">Total Teams</p>
                  <p className="text-lg font-semibold text-gray-900">{teams.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;