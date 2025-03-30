import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '@/types/global';

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    account: null,
    chainId: null,
    isConnected: false,
    provider: null,
    signer: null,
  });

  const connect = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setState({
        account,
        chainId: network.chainId,
        isConnected: true,
        provider,
        signer,
      });
    } catch (error) {
      console.error('Failed to connect to Web3:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      account: null,
      chainId: null,
      isConnected: false,
      provider: null,
      signer: null,
    });
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setState(prev => ({ ...prev, account: accounts[0] }));
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });

      window.ethereum.on('disconnect', () => {
        disconnect();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
}; 