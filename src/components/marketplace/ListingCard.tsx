import React from 'react';
import Image from 'next/image';
import { Listing } from '@/types/marketplace';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-blue-600">
            ${listing.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {listing.quantity} available
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={listing.seller.avatarUrl}
              alt={listing.seller.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{listing.seller.name}</p>
            <p className="text-xs text-gray-500">{listing.location}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => {/* Handle contact */}}
          >
            Contact
          </button>
          <button
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={() => {/* Handle save */}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}; 