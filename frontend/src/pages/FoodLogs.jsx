import { useState, useEffect } from 'react';
import { foodLogAPI } from '../services/api';
import { categories } from '../data/seedData';

const FoodLogs = () => {
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: 'pieces',
    category: '',
    notes: '',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await foodLogAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await foodLogAPI.createLog(formData);
      setFormData({
        itemName: '',
        quantity: '',
        unit: 'pieces',
        category: '',
        notes: '',
      });
      setShowForm(false);
      loadLogs();
    } catch (error) {
      console.error('Failed to create log:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await foodLogAPI.deleteLog(id);
        loadLogs();
      } catch (error) {
        console.error('Failed to delete log:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food Consumption Logs</h1>
          <p className="text-gray-600 mt-2">Track your daily food usage and consumption history</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Log'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Food Log</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Milk, Eggs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="input-field"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="liters">Liters</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="cups">Cups</option>
                  <option value="servings">Servings</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Save Log
            </button>
          </form>
        </div>
      )}

      {/* Logs List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Consumption History</h2>
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{log.itemName}</h3>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {log.quantity} {log.unit}
                  </p>
                  {log.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">{log.notes}</p>
                  )}
                  {log.date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(log.date).toLocaleDateString()} at{' '}
                      {new Date(log.date).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No food logs yet</p>
            <p className="mt-2">Start tracking your food consumption by adding your first log!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLogs;
