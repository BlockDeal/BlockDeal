import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToken } from '@/hooks/useToken';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';

interface Stake {
  amount: ethers.BigNumber;
  startTime: ethers.BigNumber;
  lockPeriod: ethers.BigNumber;
  rewards: ethers.BigNumber;
}

export default function Staking() {
  const { account } = useWeb3();
  const {
    stake,
    unstake,
    claimRewards,
    getStakeInfo,
    calculateRewards,
    balanceOf,
    loading,
    error,
  } = useToken();

  const [stakeAmount, setStakeAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('30');
  const [userBalance, setUserBalance] = useState('0');
  const [userStake, setUserStake] = useState<Stake | null>(null);
  const [pendingRewards, setPendingRewards] = useState('0');

  useEffect(() => {
    if (account) {
      loadUserData();
    }
  }, [account]);

  const loadUserData = async () => {
    if (!account) return;

    try {
      const balance = await balanceOf(account);
      setUserBalance(balance);

      const stakeInfo = await getStakeInfo(account);
      setUserStake(stakeInfo);

      if (stakeInfo) {
        const rewards = await calculateRewards(account);
        setPendingRewards(rewards);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const handleStake = async () => {
    if (!account || !stakeAmount || !lockPeriod) return;

    try {
      await stake(stakeAmount, parseInt(lockPeriod));
      await loadUserData();
    } catch (err) {
      console.error('Failed to stake:', err);
    }
  };

  const handleUnstake = async () => {
    if (!account) return;

    try {
      await unstake();
      await loadUserData();
    } catch (err) {
      console.error('Failed to unstake:', err);
    }
  };

  const handleClaimRewards = async () => {
    if (!account) return;

    try {
      await claimRewards();
      await loadUserData();
    } catch (err) {
      console.error('Failed to claim rewards:', err);
    }
  };

  const formatTimeLeft = (endTime: ethers.BigNumber) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime.toNumber() - now;
    
    if (timeLeft <= 0) return 'Completed';
    
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Staking</h2>
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
            {/* Staking Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Stake Tokens</h3>
              <div className="mt-4">
                <label htmlFor="stake-amount" className="block text-sm font-medium text-gray-700">
                  Amount to Stake
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stake-amount"
                    id="stake-amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="lock-period" className="block text-sm font-medium text-gray-700">
                  Lock Period (days)
                </label>
                <div className="mt-1">
                  <select
                    id="lock-period"
                    name="lock-period"
                    value={lockPeriod}
                    onChange={(e) => setLockPeriod(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleStake}
                  disabled={loading || !stakeAmount}
                  className="w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Stake Tokens'}
                </button>
              </div>
            </div>

            {/* Current Stake Info */}
            {userStake && (
              <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Current Stake</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Staked Amount</p>
                    <p className="text-lg font-medium text-gray-900">
                      {ethers.utils.formatEther(userStake.amount)} BDT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lock Period</p>
                    <p className="text-lg font-medium text-gray-900">
                      {userStake.lockPeriod.toNumber() / 86400} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Remaining</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatTimeLeft(userStake.startTime.add(userStake.lockPeriod))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Rewards</p>
                    <p className="text-lg font-medium text-gray-900">
                      {ethers.utils.formatEther(userStake.rewards)} BDT
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleClaimRewards}
                      disabled={loading || userStake.rewards.isZero()}
                      className="flex-1 rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                    >
                      Claim Rewards
                    </button>
                    <button
                      type="button"
                      onClick={handleUnstake}
                      disabled={loading || !userStake.startTime.add(userStake.lockPeriod).lte(ethers.BigNumber.from(Math.floor(Date.now() / 1000)))}
                      className="flex-1 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Token Balance */}
            <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Token Balance</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-lg font-medium text-gray-900">{userBalance} BDT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 