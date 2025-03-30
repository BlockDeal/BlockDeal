import React, { useState } from 'react';

interface ListingFiltersProps {
  onFilter: (filters: any) => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 1000000 },
    location: '',
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Other',
  ];

  const locations = [
    'North America',
    'Europe',
    'Asia',
    'South America',
    'Africa',
    'Oceania',
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.priceRange.min}
            onChange={(e) =>
              handleFilterChange('priceRange', {
                ...filters.priceRange,
                min: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.priceRange.max}
            onChange={(e) =>
              handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Filters Button */}
      <button
        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        onClick={() => {
          setFilters({
            category: '',
            priceRange: { min: 0, max: 1000000 },
            location: '',
          });
          onFilter({
            category: '',
            priceRange: { min: 0, max: 1000000 },
            location: '',
          });
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}; 