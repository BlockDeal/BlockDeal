import React, { useState, useMemo, useCallback } from 'react';
import { ListingCard } from './ListingCard';
import { ListingFilters } from './ListingFilters';
import { Listing, ListingFilters as ListingFiltersType } from '@/types/marketplace';

interface MarketplaceProps {
  listings: Listing[];
}

export const Marketplace: React.FC<MarketplaceProps> = ({ listings }) => {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ListingFiltersType>({
    category: '',
    priceRange: { min: 0, max: 1000000 },
    location: '',
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const filtered = listings.filter(listing => 
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredListings(filtered);
  }, [listings]);

  const handleFilter = useCallback((newFilters: ListingFiltersType) => {
    setFilters(newFilters);
    let filtered = [...listings];
    
    // Apply filters
    if (newFilters.category) {
      filtered = filtered.filter(listing => listing.category === newFilters.category);
    }
    if (newFilters.priceRange) {
      filtered = filtered.filter(listing => 
        listing.price >= newFilters.priceRange!.min && 
        listing.price <= newFilters.priceRange!.max
      );
    }
    if (newFilters.location) {
      filtered = filtered.filter(listing => listing.location === newFilters.location);
    }

    setFilteredListings(filtered);
  }, [listings]);

  // Memoize the filtered listings grid
  const listingsGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  ), [filteredListings]);

  // Memoize the empty state
  const emptyState = useMemo(() => (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-600">No listings found</h3>
      <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
    </div>
  ), []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <ListingFilters onFilter={handleFilter} />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? listingsGrid : emptyState}
        </div>
      </div>
    </div>
  );
}; 