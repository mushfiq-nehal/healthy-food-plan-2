import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import { foodItems, categories } from '../data/seedData';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    expirationDate: '',
    notes: '',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getItems();
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
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
      if (editingItem) {
        await inventoryAPI.updateItem(editingItem.id, formData);
        setEditingItem(null);
      } else {
        await inventoryAPI.createItem(formData);
      }
      setFormData({
        name: '',
        quantity: '',
        category: '',
        expirationDate: '',
        notes: '',
      });
      setShowForm(false);
      loadInventory();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      expirationDate: item.expirationDate || '',
      notes: item.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.deleteItem(id);
        loadInventory();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const filteredInventory = filterCategory
    ? inventory.filter((item) => item.category === filterCategory)
    : inventory;

  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Food Inventory</h1>
          <p className="text-gray-600 mt-2">Manage your household food items and track expiration</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({
              name: '',
              quantity: '',
              category: '',
              expirationDate: '',
              notes: '',
            });
          }}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingItem ? 'Edit Item' : 'New Inventory Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Milk, Eggs"
                  list="food-items"
                />
                <datalist id="food-items">
                  {foodItems.map((item) => (
                    <option key={item.id} value={item.name} />
                  ))}
                </datalist>
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
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="input-field"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {editingItem ? 'Update Item' : 'Add to Inventory'}
            </button>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {filterCategory && (
            <button onClick={() => setFilterCategory('')} className="text-sm text-primary-600 hover:text-primary-700">
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Inventory List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Inventory Items ({filteredInventory.length})
        </h2>
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => {
              const daysUntilExp = getDaysUntilExpiration(item.expirationDate);
              const isExpiringSoon = daysUntilExp !== null && daysUntilExp <= 7 && daysUntilExp > 0;
              const isExpired = daysUntilExp !== null && daysUntilExp < 0;

              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 ${
                    isExpired
                      ? 'border-red-300 bg-red-50'
                      : isExpiringSoon
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                  {item.expirationDate && (
                    <div className="text-sm mb-2">
                      <p className="text-gray-600">
                        Expires: {new Date(item.expirationDate).toLocaleDateString()}
                      </p>
                      {daysUntilExp !== null && (
                        <p
                          className={`font-medium ${
                            isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-700' : 'text-green-600'
                          }`}
                        >
                          {isExpired
                            ? 'Expired!'
                            : isExpiringSoon
                            ? `Expires in ${daysUntilExp} days`
                            : `${daysUntilExp} days remaining`}
                        </p>
                      )}
                    </div>
                  )}
                  {item.notes && <p className="text-sm text-gray-500 italic mb-3">{item.notes}</p>}
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(item)} className="btn-secondary text-xs flex-1">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-xs flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No items in inventory</p>
            <p className="mt-2">Start adding items to track your food storage!</p>
          </div>
        )}
      </div>

      {/* Seeded Food Items Reference */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Food Items Reference</h2>
        <p className="text-sm text-gray-600 mb-4">Use these as reference when adding items to your inventory</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {foodItems.slice(0, 15).map((item) => (
            <div key={item.id} className="text-sm p-2 bg-gray-50 rounded border border-gray-200">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-600">{item.category}</p>
              <p className="text-xs text-gray-500">~{item.expirationDays} days</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
