import { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    ethereum: any;
  }
}

export interface LayoutProps {
  children: ReactNode;
}

export interface Web3State {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  provider: any;
  signer: any;
}

export interface ContractAddresses {
  marketplace: string;
  token: string;
}

declare module 'react';
declare module 'next/image';
declare module '@/types/marketplace'; 