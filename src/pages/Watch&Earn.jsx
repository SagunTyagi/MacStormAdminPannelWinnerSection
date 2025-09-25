import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Upload } from 'lucide-react';

const AdsAdmin = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    rewardCoins: '',
    active: true,
    maxRewardsPerUser: '',
    minWatchMs: '',
    totalBudgetCoins: '',
    startsAt: '',
    endsAt: '',
    videoFile: null, // Changed to file
    thumbnailFile: null // Changed to file
  });

  const API_BASE = 'https://macstormbattle-backend-2.onrender.com/api/admin/ads';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU4MTg0MDU1LCJleHAiOjE3NTk0ODAwNTV9.T3EoD6-3d7yCz7hLSJGTTSRowC3Ic3UotQ5coY7pa_k';
  
  // Note: Don't include Content-Type for FormData - browser will set it automatically
  const getHeaders = (isFormData = false) => {
    const headers = {
      'Authorization': `Bearer ${AUTH_TOKEN}`
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  // Fetch all ads
  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE, {
        headers: getHeaders()
      });
      if (response.ok) {
        const responseData = await response.json();
        setAds(responseData.data || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch ads:', errorText);
        alert('Failed to fetch ads: ' + response.status);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      alert('Error fetching ads: ' + error.message);
    }
    setLoading(false);
  };

  // Helper function to format datetime for API
  const formatDateTimeForAPI = (dateTimeString) => {
    if (!dateTimeString) return null;
    const date = new Date(dateTimeString);
    return date.toISOString();
  };

  // Create new ad with file upload
  const createAd = async () => {
    setLoading(true);
    try {
      // Check if video file is provided
      if (!formData.videoFile) {
        alert('Video file is required');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('rewardCoins', parseFloat(formData.rewardCoins));
      formDataToSend.append('active', formData.active);
      formDataToSend.append('maxRewardsPerUser', parseInt(formData.maxRewardsPerUser));
      formDataToSend.append('minWatchMs', parseInt(formData.minWatchMs));
      formDataToSend.append('totalBudgetCoins', parseFloat(formData.totalBudgetCoins));
      
      if (formData.startsAt) {
        formDataToSend.append('startsAt', formatDateTimeForAPI(formData.startsAt));
      }
      if (formData.endsAt) {
        formDataToSend.append('endsAt', formatDateTimeForAPI(formData.endsAt));
      }
      
      // Append video file
      formDataToSend.append('video', formData.videoFile);
      
      // Append thumbnail file if provided
      if (formData.thumbnailFile) {
        formDataToSend.append('thumbnail', formData.thumbnailFile);
      }

      console.log('Sending FormData with files'); // Debug log

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: getHeaders(true), // Don't set Content-Type for FormData
        body: formDataToSend
      });

      if (response.ok) {
        await fetchAds();
        resetForm();
        alert('Ad created successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to create ad:', errorText);
        alert('Failed to create ad: ' + response.status + '\n' + errorText);
      }
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Error creating ad: ' + error.message);
    }
    setLoading(false);
  };

  // Update ad with file upload
  const updateAd = async (id) => {
    setLoading(true);
    try {
      // For updates, video file might not be required if already exists
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('rewardCoins', parseFloat(formData.rewardCoins));
      formDataToSend.append('active', formData.active);
      formDataToSend.append('maxRewardsPerUser', parseInt(formData.maxRewardsPerUser));
      formDataToSend.append('minWatchMs', parseInt(formData.minWatchMs));
      formDataToSend.append('totalBudgetCoins', parseFloat(formData.totalBudgetCoins));
      
      if (formData.startsAt) {
        formDataToSend.append('startsAt', formatDateTimeForAPI(formData.startsAt));
      }
      if (formData.endsAt) {
        formDataToSend.append('endsAt', formatDateTimeForAPI(formData.endsAt));
      }
      
      // Append video file if new one is selected
      if (formData.videoFile) {
        formDataToSend.append('video', formData.videoFile);
      }
      
      // Append thumbnail file if new one is selected
      if (formData.thumbnailFile) {
        formDataToSend.append('thumbnail', formData.thumbnailFile);
      }

      console.log('Updating with FormData'); // Debug log

      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: formDataToSend
      });

      if (response.ok) {
        await fetchAds();
        resetForm();
        alert('Ad updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to update ad:', errorText);
        alert('Failed to update ad: ' + response.status + '\n' + errorText);
      }
    } catch (error) {
      console.error('Error updating ad:', error);
      alert('Error updating ad: ' + error.message);
    }
    setLoading(false);
  };

  // Delete ad
  const deleteAd = async (id) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.ok) {
        await fetchAds();
        alert('Ad deleted successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to delete ad:', errorText);
        alert('Failed to delete ad: ' + response.status + '\n' + errorText);
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Error deleting ad: ' + error.message);
    }
    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.rewardCoins || parseFloat(formData.rewardCoins) <= 0) {
      alert('Reward coins must be greater than 0');
      return;
    }
    
    if (!formData.maxRewardsPerUser || parseInt(formData.maxRewardsPerUser) <= 0) {
      alert('Max rewards per user must be greater than 0');
      return;
    }
    
    if (!formData.minWatchMs || parseInt(formData.minWatchMs) <= 0) {
      alert('Minimum watch time must be greater than 0');
      return;
    }
    
    if (!formData.totalBudgetCoins || parseFloat(formData.totalBudgetCoins) <= 0) {
      alert('Total budget must be greater than 0');
      return;
    }

    // Video file validation for new ads
    if (!editingAd && !formData.videoFile) {
      alert('Video file is required');
      return;
    }

    // Date validation
    if (formData.startsAt && formData.endsAt) {
      const startDate = new Date(formData.startsAt);
      const endDate = new Date(formData.endsAt);
      if (startDate >= endDate) {
        alert('End date must be after start date');
        return;
      }
    }
    
    if (editingAd) {
      updateAd(editingAd.id);
    } else {
      createAd();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      rewardCoins: '',
      active: true,
      maxRewardsPerUser: '',
      minWatchMs: '',
      totalBudgetCoins: '',
      startsAt: '',
      endsAt: '',
      videoFile: null,
      thumbnailFile: null
    });
    setShowForm(false);
    setEditingAd(null);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
  };

  // Edit ad
  const editAd = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title || '',
      rewardCoins: ad.rewardCoins?.toString() || '',
      active: ad.active || false,
      maxRewardsPerUser: ad.maxRewardsPerUser?.toString() || '',
      minWatchMs: ad.minWatchMs?.toString() || '',
      totalBudgetCoins: ad.totalBudgetCoins?.toString() || '',
      startsAt: ad.startsAt ? new Date(ad.startsAt).toISOString().slice(0, 16) : '',
      endsAt: ad.endsAt ? new Date(ad.endsAt).toISOString().slice(0, 16) : '',
      videoFile: null, // Reset file inputs for editing
      thumbnailFile: null
    });
    setShowForm(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Load ads on component mount
  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-250 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ads Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your advertising campaigns</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Plus size={20} />
                Create New Ad
              </button>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {editingAd ? 'Edit Ad' : 'Create New Ad'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reward Coins *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="rewardCoins"
                        value={formData.rewardCoins}
                        onChange={handleInputChange}
                        required
                        min="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Rewards Per User *
                      </label>
                      <input
                        type="number"
                        name="maxRewardsPerUser"
                        value={formData.maxRewardsPerUser}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Watch Time (ms) *
                      </label>
                      <input
                        type="number"
                        name="minWatchMs"
                        value={formData.minWatchMs}
                        onChange={handleInputChange}
                        required
                        min="1000"
                        placeholder="15000 (15 seconds)"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Budget Coins *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="totalBudgetCoins"
                        value={formData.totalBudgetCoins}
                        onChange={handleInputChange}
                        required
                        min="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        name="startsAt"
                        value={formData.startsAt}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        name="endsAt"
                        value={formData.endsAt}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video File * {editingAd && '(Upload new to replace existing)'}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="videoFile"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a video file</span>
                              <input
                                id="videoFile"
                                name="videoFile"
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                          {formData.videoFile && (
                            <p className="text-sm text-green-600 font-medium">
                              Selected: {formData.videoFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail File (Optional)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="thumbnailFile"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload thumbnail</span>
                              <input
                                id="thumbnailFile"
                                name="thumbnailFile"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                          {formData.thumbnailFile && (
                            <p className="text-sm text-green-600 font-medium">
                              Selected: {formData.thumbnailFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : (editingAd ? 'Update' : 'Create')} Ad
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ads Table */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}

            {!loading && ads.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <Plus size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No ads found</p>
                <p className="text-gray-400">Create your first ad to get started!</p>
              </div>
            )}

            {!loading && ads.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reward
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {(ad.thumbnail || ad.thumbnailUrl) && (
                              <img 
                                src={ad.thumbnail || ad.thumbnailUrl} 
                                alt={ad.title}
                                className="h-10 w-10 rounded-md object-cover mr-3"
                                onError={(e) => {e.target.style.display = 'none'}}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {ad.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                Max {ad.maxRewardsPerUser} per user
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {parseFloat(ad.rewardCoins).toFixed(2)} coins
                          </div>
                          <div className="text-xs text-gray-500">
                            {(ad.minWatchMs / 1000).toFixed(1)}s watch
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            ad.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {ad.active ? <Eye size={12} /> : <EyeOff size={12} />}
                            {ad.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{parseFloat(ad.totalBudgetCoins).toLocaleString()} coins</div>
                          <div className="text-xs text-gray-500">
                            Used: {parseFloat(ad.consumedCoins || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{formatDate(ad.startsAt)}</div>
                          <div>to {formatDate(ad.endsAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => editAd(ad)}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 p-1"
                            title="Edit ad"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteAd(ad.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 p-1"
                            title="Delete ad"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsAdmin;