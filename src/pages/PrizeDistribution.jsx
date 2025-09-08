import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, Trophy, Gift, Users, Zap } from 'lucide-react';

const TournamentAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('prizes');
  const [editingItem, setEditingItem] = useState(null);

  // Sample data - will be replaced with API calls later
  const [prizes, setPrizes] = useState([
    {
      id: 1,
      place: 1,
      amount: 25000,
      currency: '₹',
      benefits: ['Champion title and trophy', 'Exclusive in-game items', 'Hall of Fame recognition']
    },
    {
      id: 2,
      place: 2,
      amount: 15000,
      currency: '₹',
      benefits: ['Silver medal badge', 'Social media feature']
    },
    {
      id: 3,
      place: 3,
      amount: 10000,
      currency: '₹',
      benefits: ['Bronze medal', 'Special mention', 'Bonus in-game currency']
    }
  ]);

  const [additionalBenefits, setAdditionalBenefits] = useState([
    {
      id: 1,
      category: 'Featured Benefits',
      icon: 'gift',
      items: [
        { id: 101, name: 'Exclusive Items', description: 'Special in-game items and cosmetics for all participants' }
      ]
    },
    {
      id: 2,
      category: 'Recognition',
      icon: 'trophy',
      items: [
        { id: 201, name: 'Featured profile and social media highlights', description: '' }
      ]
    },
    {
      id: 3,
      category: 'Pro Opportunities',
      icon: 'users',
      items: [
        { id: 301, name: 'Chance to join professional gaming teams', description: '' }
      ]
    },
    {
      id: 4,
      category: 'Community Perks',
      icon: 'zap',
      items: [
        { id: 401, name: 'Exclusive Discord Access', description: 'Access to VIP Discord channels' },
        { id: 402, name: 'Priority Registration', description: 'Priority registration for future tournaments' },
        { id: 403, name: 'Streaming Permissions', description: 'Special streaming permissions on official channels' }
      ]
    }
  ]);

  const [newPrize, setNewPrize] = useState({ place: '', amount: '', currency: '₹', benefits: [''] });
  const [newBenefit, setNewBenefit] = useState({ category: '', icon: 'gift', items: [{ name: '', description: '' }] });

  const getIconComponent = (iconName) => {
    const icons = {
      gift: Gift,
      trophy: Trophy,
      users: Users,
      zap: Zap
    };
    const IconComponent = icons[iconName] || Gift;
    return <IconComponent className="w-5 h-5" />;
  };

  const addPrize = () => {
    if (newPrize.place && newPrize.amount) {
      const prize = {
        id: Date.now(),
        place: parseInt(newPrize.place),
        amount: parseInt(newPrize.amount),
        currency: newPrize.currency,
        benefits: newPrize.benefits.filter(b => b.trim() !== '')
      };
      setPrizes([...prizes, prize].sort((a, b) => a.place - b.place));
      setNewPrize({ place: '', amount: '', currency: '₹', benefits: [''] });
    }
  };

  const deletePrize = (id) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const addBenefitCategory = () => {
    if (newBenefit.category) {
      const benefit = {
        id: Date.now(),
        category: newBenefit.category,
        icon: newBenefit.icon,
        items: newBenefit.items.filter(item => item.name.trim() !== '')
      };
      setAdditionalBenefits([...additionalBenefits, benefit]);
      setNewBenefit({ category: '', icon: 'gift', items: [{ name: '', description: '' }] });
    }
  };

  const deleteBenefitCategory = (id) => {
    setAdditionalBenefits(additionalBenefits.filter(b => b.id !== id));
  };

  const updateBenefitItem = (categoryId, itemId, field, value) => {
    setAdditionalBenefits(additionalBenefits.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return category;
    }));
  };

  const addBenefitItem = (categoryId) => {
    setAdditionalBenefits(additionalBenefits.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [...category.items, { id: Date.now(), name: '', description: '' }]
        };
      }
      return category;
    }));
  };

  const deleteBenefitItem = (categoryId, itemId) => {
    setAdditionalBenefits(additionalBenefits.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    }));
  };

  return (
<div className="min-h-screen text-gray-800">

      {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <h1 className="text-3xl font-bold text-white">Prize distribution</h1>
        <p className="text-blue-100 mt-2">Manage prizes, benefits, and tournament settings</p>
      </div> */}
       <div className="bg-white rounded-xl shadow-lg p-6 mb-6 mx-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Prize distribution</h1>
              <p className="text-gray-600">Manage prizes, benefits, and tournament settings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('prizes')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'prizes' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Cash Prizes & Ranks
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'benefits' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Gift className="w-5 h-5 inline mr-2" />
            Additional Benefits
          </button>
        </div>

        {/* Prizes Tab */}
        {activeTab === 'prizes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Prize Configuration</h2>
              
              {/* Existing Prizes */}
              <div className="space-y-4 mb-6">
                {prizes.map((prize) => (
                  <div key={prize.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {prize.place === 1 ? '1st' : prize.place === 2 ? '2nd' : prize.place === 3 ? '3rd' : `${prize.place}th`} Place
                          </h3>
                          <p className="text-2xl font-bold text-blue-600">
                            {prize.currency}{prize.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePrize(prize.id)}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {prize.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Prize */}
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                <h3 className="font-bold mb-4 text-gray-800">Add New Prize</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Place</label>
                    <input
                      type="number"
                      value={newPrize.place}
                      onChange={(e) => setNewPrize({...newPrize, place: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="1, 2, 3..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
                    <input
                      type="number"
                      value={newPrize.amount}
                      onChange={(e) => setNewPrize({...newPrize, amount: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="25000"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
                    <select
                      value={newPrize.currency}
                      onChange={(e) => setNewPrize({...newPrize, currency: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="₹">₹ (INR)</option>
                      <option value="$">$ (USD)</option>
                      <option value="€">€ (EUR)</option>
                    </select>
                  </div> */}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Benefits</label>
                  {newPrize.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const updated = [...newPrize.benefits];
                          updated[idx] = e.target.value;
                          setNewPrize({...newPrize, benefits: updated});
                        }}
                        className="flex-1 p-3 bg-gray-50 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter benefit..."
                      />
                      {idx === newPrize.benefits.length - 1 && (
                        <button
                          onClick={() => setNewPrize({...newPrize, benefits: [...newPrize.benefits, '']})}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addPrize}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-sm"
                >
                  Add Prize
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-purple-600">Additional Benefits</h2>
              
              {/* Existing Benefit Categories */}
              <div className="space-y-6 mb-6">
                {additionalBenefits.map((category) => (
                  <div key={category.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-2">
                          {getIconComponent(category.icon)}
                          <span className="sr-only">Icon</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{category.category}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addBenefitItem(category.id)}
                          className="text-green-500 hover:text-green-600 p-2 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteBenefitCategory(category.id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {category.items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateBenefitItem(category.id, item.id, 'name', e.target.value)}
                              className="flex-1 p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              placeholder="Benefit name..."
                            />
                            <button
                              onClick={() => deleteBenefitItem(category.id, item.id)}
                              className="ml-2 text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateBenefitItem(category.id, item.id, 'description', e.target.value)}
                            className="w-full p-2 bg-gray-50 rounded border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="Description (optional)..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Benefit Category */}
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                <h3 className="font-bold mb-4 text-gray-800">Add New Benefit Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={newBenefit.category}
                      onChange={(e) => setNewBenefit({...newBenefit, category: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="e.g., Community Perks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Icon</label>
                    <select
                      value={newBenefit.icon}
                      onChange={(e) => setNewBenefit({...newBenefit, icon: e.target.value})}
                      className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="gift">Gift</option>
                      <option value="trophy">Trophy</option>
                      <option value="users">Users</option>
                      <option value="zap">Zap</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Benefits</label>
                  {newBenefit.items.map((item, idx) => (
                    <div key={idx} className="space-y-2 mb-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...newBenefit.items];
                          updated[idx].name = e.target.value;
                          setNewBenefit({...newBenefit, items: updated});
                        }}
                        className="w-full p-2 bg-white rounded border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Benefit name..."
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...newBenefit.items];
                          updated[idx].description = e.target.value;
                          setNewBenefit({...newBenefit, items: updated});
                        }}
                        className="w-full p-2 bg-white rounded border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Description (optional)..."
                      />
                      {idx === newBenefit.items.length - 1 && (
                        <button
                          onClick={() => setNewBenefit({...newBenefit, items: [...newBenefit.items, {name: '', description: ''}]})}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add Item
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addBenefitCategory}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-sm"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            <Save className="w-6 h-6 inline mr-2" />
            Save All Changes
          </button>

        </div>
      </div>
    </div>
  );
};

export default TournamentAdminPanel;