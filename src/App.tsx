import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';

import Home from './Home';

import Wallet from './Components/WalletComponent/WalletMain';    

import { ethers, BrowserProvider } from 'ethers';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from '@web3modal/ethers/react';

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set');
}

const chains = [
  {
    chainId: 666666666,
    name: 'Degen Chain',
    currency: 'DEGEN',
    explorerUrl: 'https://explorer.degen.tips:443/',
    rpcUrl: 'https://rpc-degen-mainnet-1.t.conduit.xyz'
  },
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    currency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc'
  },
  {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org'
  },
  {
    chainId: 10,
    name: 'Optimism',
    currency: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/XmTfwyK5Tar5RGmyxjyFFL9G2fm_6TuY'
  },
  {
    chainId: 7777777,
    name: 'Zora Network',
    currency: 'ETH',
    explorerUrl: 'https://explorer.zora.energy',
    rpcUrl: 'https://rpc.zora.energy'
  }
];

const ethersConfig = defaultConfig({
  metadata: {
    name: 'Harold and the Purple Crayon ',
    description: '',
    url: 'https://haroldandthepurplecrayon.netlify.app/',
    icons: ['images/favicon.png']
  },
  defaultChainId: 666666666,
  rpcUrl: 'https://rpc-degen-mainnet-1.t.conduit.xyz',
  auth: {
    email: true,
    socials: ['google', 'x', 'apple'],
    showWallets: true,
    walletFeatures: true
  }
});

const modal = createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': 'blue',
    '--w3m-color-mix-strength': 25
  },
  chainImages: {
    42161: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    8453: 'https://www.kunai.finance/static/media/Base_Network_Logo.cfdb6720.png',
    10: 'https://assets.coingecko.com/coins/images/25244/large/OP.jpeg?1651026279',
    7777777: 'https://media.licdn.com/dms/image/C4E0BAQE2QFmWjvYbLw/company-logo_200_200/0/1679507991235/ourzora_logo?e=2147483647&v=beta&t=fm_w5of8cLl7CsiMbZG_ouXOirfFqTE2PBHfprsktWc',
    666666666: 'https://dd.dexscreener.com/ds-data/tokens/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png?size=lg&key=e17c44'
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  ]
});


  const App = () => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [connected, setConnected] = useState(false);

    const { open, close } = useWeb3Modal();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    useEffect(() => {
      const connectWalletOnPageLoad = async () => {
        if (localStorage.getItem("isWalletConnected") === "true") {
          await connectWallet();
        }
      };
      connectWalletOnPageLoad();
    }, []);

    const connectWallet = async () => {
      try {
        await open();
        if (walletProvider) {
          const provider = new BrowserProvider(walletProvider);
          setProvider(provider);
          setConnected(true);
          localStorage.setItem("isWalletConnected", "true");
        } else {
          console.error("walletProvider is undefined");
        }
      } catch (error) {
        console.error("Could not get a wallet connection", error);
      }
    };


    const disconnectWallet = async () => {
      await close();
      setProvider(null);
      setConnected(false);
      localStorage.removeItem("isWalletConnected");
    };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Router>
  );
};

export default App;
