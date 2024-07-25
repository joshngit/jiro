import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId
const projectId = import.meta.env['VITE_WALLET_CONNECT_PROJECT_ID'] || '';
const chainId = Number(import.meta.env['VITE_CHAIN_ID']);

// 2. Set chains
const network = {
  chainId,
  name: 'JOC Testnet',
  currency: 'JOCT',
  explorerUrl: 'https://explorer.testnet.japanopenchain.org',
  rpcUrl: 'https://rpc-1.testnet.japanopenchain.org:8545',
};

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: chainId,
});

// 5. Create a Web3Modal instance
export const modal = createWeb3Modal({
  ethersConfig,
  chains: [network],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});
