import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { Web3State } from '@/types/global';
import { SUPPORTED_CHAINS, CHAIN_NAMES } from '@/config';

// Contract ABIs
import MarketplaceABI from '@/contracts/abis/Marketplace.json';
import TokenABI from '@/contracts/abis/BlockDealToken.json';

// Contract addresses
const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '';
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '';

interface Web3ContextType extends Web3State {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  chainId: null,
  isConnected: false,
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: async () => {},
  switchNetwork: async () => {},
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Web3State>({
    account: null,
    chainId: null,
    isConnected: false,
    provider: null,
    signer: null,
  });

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {},
  });

  const connect = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
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

      // Subscribe to accounts change
      instance.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setState(prev => ({ ...prev, account: accounts[0] }));
        }
      });

      // Subscribe to chainId change
      instance.on('chainChanged', (chainId: number) => {
        setState(prev => ({ ...prev, chainId: Number(chainId) }));
      });

      // Subscribe to provider disconnection
      instance.on('disconnect', () => {
        disconnect();
      });
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const disconnect = async () => {
    web3Modal.clearCachedProvider();
    setState({
      account: null,
      chainId: null,
      isConnected: false,
      provider: null,
      signer: null,
    });
  };

  const switchNetwork = async (chainId: number) => {
    if (!state.provider) return;

    try {
      await (state.provider as any).provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, prompt to add it
        const chainName = CHAIN_NAMES[chainId as keyof typeof CHAIN_NAMES];
        if (!chainName) throw new Error('Unsupported chain');

        await (state.provider as any).provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName,
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [process.env.NEXT_PUBLIC_TESTNET_RPC_URL],
          }],
        });
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ ...state, connect, disconnect, switchNetwork }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);

// Custom hooks for specific contract interactions
export function useMarketplace() {
  const { signer } = useWeb3();
  const marketplace = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MarketplaceABI,
    signer
  );
  return marketplace;
}

export function useToken() {
  const { signer } = useWeb3();
  const token = new ethers.Contract(
    TOKEN_ADDRESS,
    TokenABI,
    signer
  );
  return token;
}

export function useAccount() {
  const { account } = useWeb3();
  return account;
}

export function useChainId() {
  const { chainId } = useWeb3();
  return chainId;
}

export function useConnect() {
  const { connect, disconnect, isConnected } = useWeb3();
  return { connect, disconnect, isConnected };
} 