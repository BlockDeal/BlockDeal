import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToken as useTokenContract } from '@/context/Web3Context';

interface Stake {
  amount: ethers.BigNumber;
  startTime: ethers.BigNumber;
  lockPeriod: ethers.BigNumber;
  rewards: ethers.BigNumber;
}

export function useToken() {
  const token = useTokenContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(async (to: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await token.mint(to);
      await tx.wait();
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const burn = useCallback(async (amount: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await token.burn(amountWei);
      await tx.wait();
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to burn tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const stake = useCallback(async (amount: string, lockPeriod: number) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const amountWei = ethers.utils.parseEther(amount);
      const lockPeriodSeconds = lockPeriod * 24 * 60 * 60; // Convert days to seconds
      const tx = await token.stake(amountWei, lockPeriodSeconds);
      await tx.wait();
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stake tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const unstake = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await token.unstake();
      await tx.wait();
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unstake tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const claimRewards = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tx = await token.claimRewards();
      await tx.wait();
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getStakeInfo = useCallback(async (address: string): Promise<Stake | null> => {
    if (!token) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const stakeInfo = await token.getStakeInfo(address);
      return stakeInfo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get stake info');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const calculateRewards = useCallback(async (address: string): Promise<string> => {
    if (!token) return '0';
    
    try {
      setLoading(true);
      setError(null);
      
      const rewards = await token.calculateRewards(address);
      return ethers.utils.formatEther(rewards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate rewards');
      return '0';
    } finally {
      setLoading(false);
    }
  }, [token]);

  const balanceOf = useCallback(async (address: string): Promise<string> => {
    if (!token) return '0';
    
    try {
      setLoading(true);
      setError(null);
      
      const balance = await token.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get balance');
      return '0';
    } finally {
      setLoading(false);
    }
  }, [token]);

  const allowance = useCallback(async (owner: string, spender: string): Promise<string> => {
    if (!token) return '0';
    
    try {
      setLoading(true);
      setError(null);
      
      const allowanceAmount = await token.allowance(owner, spender);
      return ethers.utils.formatEther(allowanceAmount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get allowance');
      return '0';
    } finally {
      setLoading(false);
    }
  }, [token]);

  const approve = useCallback(async (spender: string, amount: string) => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await token.approve(spender, amountWei);
      await tx.wait();
      
      return tx;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    mint,
    burn,
    stake,
    unstake,
    claimRewards,
    getStakeInfo,
    calculateRewards,
    balanceOf,
    allowance,
    approve,
  };
} 