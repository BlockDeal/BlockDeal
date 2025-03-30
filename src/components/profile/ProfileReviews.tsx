import React from 'react';
import Image from 'next/image';

interface Review {
  id: string;
  reviewer: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
  transactionId: string;
}

interface ProfileReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const ProfileReviews: React.FC<ProfileReviewsProps> = ({
  reviews,
  averageRating,
  totalReviews,
}) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start space-x-4">
              {/* Reviewer Avatar */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={review.reviewer.avatarUrl}
                  alt={review.reviewer.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {review.reviewer.name}
                  </h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-gray-600">{review.comment}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-blue-600">
                    Transaction #{review.transactionId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600">
            No reviews yet
          </h3>
          <p className="text-gray-500 mt-2">
            Reviews will appear here after transactions
          </p>
        </div>
      )}
    </div>
  );
}; 