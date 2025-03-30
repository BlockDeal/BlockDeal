import React from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';

interface NFTCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: string;
  seller?: string;
  isAuction?: boolean;
  highestBid?: string;
  endTime?: number;
  onBuy?: () => void;
  onBid?: () => void;
}

export default function NFTCard({
  id,
  name,
  description,
  image,
  price,
  seller,
  isAuction,
  highestBid,
  endTime,
  onBuy,
  onBid,
}: NFTCardProps) {
  const formatPrice = (price: string) => {
    return `${ethers.utils.formatEther(price)} ETH`;
  };

  const formatTimeLeft = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return 'Ended';
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-right">
          {isAuction ? (
            <>
              <p className="text-sm font-medium text-gray-900">
                Highest Bid: {highestBid && formatPrice(highestBid)}
              </p>
              {endTime && (
                <p className="text-sm text-gray-500">
                  Time Left: {formatTimeLeft(endTime)}
                </p>
              )}
              {onBid && (
                <button
                  onClick={onBid}
                  className="mt-2 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Place Bid
                </button>
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-900">
                Price: {price && formatPrice(price)}
              </p>
              {seller && (
                <p className="text-sm text-gray-500">
                  Seller: {`${seller.slice(0, 6)}...${seller.slice(-4)}`}
                </p>
              )}
              {onBuy && (
                <button
                  onClick={onBuy}
                  className="mt-2 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Buy Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 