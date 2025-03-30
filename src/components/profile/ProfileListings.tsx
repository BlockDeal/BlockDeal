import React, { useMemo } from 'react';
import { Listing } from '@/types/marketplace';
import Image from 'next/image';

interface ProfileListingsProps {
  listings: Listing[];
  isOwnProfile: boolean;
  onEditListing: (listingId: string) => void;
  onDeleteListing: (listingId: string) => void;
}

export const ProfileListings: React.FC<ProfileListingsProps> = ({
  listings,
  isOwnProfile,
  onEditListing,
  onDeleteListing,
}) => {
  // Memoize the listings grid
  const listingsGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Listing Image */}
          <div className="relative h-48">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              layout="fill"
              objectFit="cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSAyVC08MTY3LjIyOUFTRjo/Tj4yMkhiSk46NjU1VkZFRkpLUlVWV1b/2wBDARUXFx4aHjshITtBNkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            {isOwnProfile && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => onEditListing(listing.id)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteListing(listing.id)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Listing Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {listing.title}
            </h3>
            <p className="mt-2 text-gray-600 line-clamp-2">
              {listing.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                ${listing.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                {listing.quantity} available
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">{listing.category}</span>
              <span className="text-sm text-gray-500">{listing.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [listings, isOwnProfile, onEditListing, onDeleteListing]);

  // Memoize the empty state
  const emptyState = useMemo(() => (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-600">No listings yet</h3>
      {isOwnProfile && (
        <p className="text-gray-500 mt-2">
          Start by creating your first listing
        </p>
      )}
    </div>
  ), [isOwnProfile]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Listings</h2>
      {listings.length > 0 ? listingsGrid : emptyState}
    </div>
  );
}; 