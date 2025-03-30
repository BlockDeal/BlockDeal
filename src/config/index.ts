import { ContractAddresses } from '@/types/global';

export const SUPPORTED_CHAINS = [1, 3, 4, 5, 42]; // Mainnet, Ropsten, Rinkeby, Goerli, Kovan

export const CONTRACT_ADDRESSES: ContractAddresses = {
  marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
  token: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '',
};

export const RPC_URLS = {
  1: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || '',
  3: process.env.NEXT_PUBLIC_ROPSTEN_RPC_URL || '',
  4: process.env.NEXT_PUBLIC_RINKEBY_RPC_URL || '',
  5: process.env.NEXT_PUBLIC_GOERLI_RPC_URL || '',
  42: process.env.NEXT_PUBLIC_KOVAN_RPC_URL || '',
};

export const CHAIN_NAMES = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten Testnet',
  4: 'Rinkeby Testnet',
  5: 'Goerli Testnet',
  42: 'Kovan Testnet',
}; 