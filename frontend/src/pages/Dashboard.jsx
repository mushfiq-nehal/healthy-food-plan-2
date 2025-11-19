import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { foodLogAPI, inventoryAPI } from '../services/api';
import { resources } from '../data/seedData';

const Dashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logsRes, inventoryRes] = await Promise.all([
        foodLogAPI.getLogs(),
        inventoryAPI.getItems(),
      ]);
      
      setLogs(logsRes.data.slice(0, 5));
      setInventory(inventoryRes.data.slice(0, 5));
      
      // Simple recommendation logic based on logged categories
      const loggedCategories = logsRes.data.map(log => log.category);
      const recommended = resources.filter(resource => 
        resource.relatedCategories.some(cat => loggedCategories.includes(cat) || cat === 'all')
      ).slice(0, 3);
      
      setRecommendedResources(recommended);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.username}! Here's your food management overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Logs</p>
              <p className="text-3xl font-bold text-blue-900">{logs.length}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Inventory Items</p>
              <p className="text-3xl font-bold text-green-900">{inventory.length}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Resources</p>
              <p className="text-3xl font-bold text-purple-900">{resources.length}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Logs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Food Logs</h2>
            <Link to="/logs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{log.itemName}</p>
                    <p className="text-sm text-gray-600">{log.quantity} {log.unit}</p>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                    {log.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No food logs yet. Start tracking your consumption!</p>
              <Link to="/logs" className="btn-primary mt-4 inline-block">
                Add First Log
              </Link>
            </div>
          )}
        </div>

        {/* Inventory Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
            <Link to="/inventory" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Manage →
            </Link>
          </div>
          {inventory.length > 0 ? (
            <div className="space-y-3">
              {inventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Your inventory is empty. Add items to track!</p>
              <Link to="/inventory" className="btn-primary mt-4 inline-block">
                Add Items
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Resources */}
        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Resources for You</h2>
          {recommendedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedResources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{resource.type === 'video' ? '🎥' : '📄'}</span>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{resource.description.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500 italic">
                    Related to: {resource.relatedCategories.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Start logging food to get personalized recommendations!</p>
            </div>
          )}
          <div className="mt-4 text-center">
            <Link to="/resources" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Resources →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
