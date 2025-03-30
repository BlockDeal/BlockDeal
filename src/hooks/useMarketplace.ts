import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import { CONTRACT_ADDRESSES } from '@/config';
import MarketplaceABI from '@/contracts/deployment.json';

interface ListingParams {
  tokenId: string;
  price: string;
  duration?: number;
}

interface AuctionParams {
  tokenId: string;
  startingPrice: string;
  duration: number;
}

export function useMarketplace() {
  const { signer } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const marketplace = new ethers.Contract(
    CONTRACT_ADDRESSES.marketplace,
    MarketplaceABI.marketplace.abi,
    signer
  );

  const listItem = async ({ tokenId, price, duration = 0 }: ListingParams) => {
    if (!signer) throw new Error('No signer available');
    setLoading(true);
    setError(null);

    try {
      const priceInWei = ethers.utils.parseEther(price);
      const tx = await marketplace.listItem(tokenId, priceInWei, duration);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Failed to list item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buyItem = async (listingId: string, price: string) => {
    if (!signer) throw new Error('No signer available');
    setLoading(true);
    setError(null);

    try {
      const priceInWei = ethers.utils.parseEther(price);
      const tx = await marketplace.buyItem(listingId, { value: priceInWei });
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Failed to buy item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAuction = async ({ tokenId, startingPrice, duration }: AuctionParams) => {
    if (!signer) throw new Error('No signer available');
    setLoading(true);
    setError(null);

    try {
      const priceInWei = ethers.utils.parseEther(startingPrice);
      const tx = await marketplace.createAuction(tokenId, priceInWei, duration);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Failed to create auction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (auctionId: string, bidAmount: string) => {
    if (!signer) throw new Error('No signer available');
    setLoading(true);
    setError(null);

    try {
      const bidInWei = ethers.utils.parseEther(bidAmount);
      const tx = await marketplace.placeBid(auctionId, { value: bidInWei });
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Failed to place bid');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const endAuction = async (auctionId: string) => {
    if (!signer) throw new Error('No signer available');
    setLoading(true);
    setError(null);

    try {
      const tx = await marketplace.endAuction(auctionId);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message || 'Failed to end auction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getListings = async () => {
    try {
      const listings = await marketplace.getListings();
      return listings.map((listing: any) => ({
        id: listing.id.toString(),
        tokenId: listing.tokenId.toString(),
        seller: listing.seller,
        price: ethers.utils.formatEther(listing.price),
        duration: listing.duration.toNumber(),
        active: listing.active,
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings');
      throw err;
    }
  };

  const getAuctions = async () => {
    try {
      const auctions = await marketplace.getAuctions();
      return auctions.map((auction: any) => ({
        id: auction.id.toString(),
        tokenId: auction.tokenId.toString(),
        seller: auction.seller,
        highestBidder: auction.highestBidder,
        highestBid: ethers.utils.formatEther(auction.highestBid),
        startingPrice: ethers.utils.formatEther(auction.startingPrice),
        endTime: auction.endTime.toNumber(),
        ended: auction.ended,
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auctions');
      throw err;
    }
  };

  return {
    listItem,
    buyItem,
    createAuction,
    placeBid,
    endAuction,
    getListings,
    getAuctions,
    loading,
    error,
  };
} 