import React from 'react';
import { useWeb3 } from '@/context/Web3Context';

export default function ConnectButton() {
  const { account, isConnected, connect, disconnect } = useWeb3();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      {isConnected ? (
        <>
          <span className="mr-2">•</span>
          {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
} 