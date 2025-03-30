import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';

interface Auction {
  id: number;
  seller: string;
  startingPrice: ethers.BigNumber;
  highestBid: ethers.BigNumber;
  highestBidder: string;
  endTime: ethers.BigNumber;
  ended: boolean;
  exists: boolean;
}

export default function Auctions() {
  const { account } = useWeb3();
  const { getAuction, placeBid, endAuction, loading, error } = useMarketplace();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);

  useEffect(() => {
    // In a real application, you would fetch all auctions from the contract
    // For now, we'll use mock data
    const mockAuctions: Auction[] = [
      {
        id: 1,
        seller: '0x1234...5678',
        startingPrice: ethers.utils.parseEther('1.0'),
        highestBid: ethers.utils.parseEther('1.5'),
        highestBidder: '0x8765...4321',
        endTime: ethers.BigNumber.from(Math.floor(Date.now() / 1000) + 86400), // 24 hours from now
        ended: false,
        exists: true,
      },
      // Add more mock auctions as needed
    ];
    setAuctions(mockAuctions);
  }, []);

  const handleBid = async (auctionId: number) => {
    if (!account || !bidAmount) return;

    try {
      await placeBid(auctionId, bidAmount);
      // Refresh auction data after successful bid
      const updatedAuction = await getAuction(auctionId);
      if (updatedAuction) {
        setAuctions(auctions.map(a => 
          a.id === auctionId ? updatedAuction : a
        ));
      }
    } catch (err) {
      console.error('Failed to place bid:', err);
    }
  };

  const handleEndAuction = async (auctionId: number) => {
    if (!account) return;

    try {
      await endAuction(auctionId);
      // Refresh auction data after successful end
      const updatedAuction = await getAuction(auctionId);
      if (updatedAuction) {
        setAuctions(auctions.map(a => 
          a.id === auctionId ? updatedAuction : a
        ));
      }
    } catch (err) {
      console.error('Failed to end auction:', err);
    }
  };

  const formatTimeLeft = (endTime: ethers.BigNumber) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime.toNumber() - now;
    
    if (timeLeft <= 0) return 'Ended';
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Auctions</h2>
            <button
              type="button"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Create Auction
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {auctions.map((auction) => (
              <div key={auction.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={`/images/auction-${auction.id}.jpg`}
                    alt={`Auction ${auction.id}`}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        Auction #{auction.id}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Seller: {auction.seller}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {ethers.utils.formatEther(auction.highestBid)} ETH
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Starting Price: {ethers.utils.formatEther(auction.startingPrice)} ETH
                  </p>
                  <p className="text-sm text-gray-500">
                    Time Left: {formatTimeLeft(auction.endTime)}
                  </p>
                </div>
                {!auction.ended && (
                  <div className="mt-4">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Bid amount in ETH"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      />
                      <button
                        onClick={() => handleBid(auction.id)}
                        disabled={loading}
                        className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Place Bid'}
                      </button>
                    </div>
                  </div>
                )}
                {auction.seller === account && !auction.ended && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleEndAuction(auction.id)}
                      disabled={loading}
                      className="w-full rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                    >
                      End Auction
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 