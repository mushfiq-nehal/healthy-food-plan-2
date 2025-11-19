import { useState } from 'react';
import { resources, resourceCategories } from '../data/seedData';

const Resources = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = !filterCategory || resource.category === filterCategory;
    const matchesType = !filterType || resource.type === filterType;
    return matchesCategory && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resources for Sustainable Practices</h1>
        <p className="text-gray-600 mt-2">
          Tips, guides, and resources for reducing waste and improving nutrition
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Resources</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {resourceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
            </select>
          </div>

          {(filterCategory || filterType) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory('');
                  setFilterType('');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">
                {resource.type === 'video' ? '🎥' : '📄'}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                  {resource.category
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

            <div className="mb-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Related to:</p>
              <div className="flex flex-wrap gap-1">
                {resource.relatedCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Resource →
            </a>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                Why recommended: This resource relates to{' '}
                {resource.relatedCategories.join(', ').replace('all', 'general sustainability')} topics
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-lg text-gray-500">No resources found matching your filters</p>
          <button
            onClick={() => {
              setFilterCategory('');
              setFilterType('');
            }}
            className="btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{resources.length}</p>
            <p className="text-sm text-gray-600">Total Resources</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {resources.filter((r) => r.type === 'article').length}
            </p>
            <p className="text-sm text-gray-600">Articles</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {resources.filter((r) => r.type === 'video').length}
            </p>
            <p className="text-sm text-gray-600">Videos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{resourceCategories.length}</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
