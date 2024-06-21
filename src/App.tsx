import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';


import Home from './Home';
import Mini from './Components/MiniSwapper/MiniSwapper';

import { ethers } from 'ethers';
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
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
    email: false,
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

    666666666: 'https://dd.dexscreener.com/ds-data/tokens/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png?size=lg&key=e17c44'
  },
  featuredWalletIds: [
    // 'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d',
    // 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  ]
});

const App = () => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [connected, setConnected] = useState(false);

  const { open, close } = useWeb3Modal();

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
      const instance = await open();
      const provider = new Web3Provider(window.ethereum as any);
      setProvider(provider);
      setConnected(true);
      localStorage.setItem("isWalletConnected", "true");
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
              <Route path="/swap" element={<Mini />} />
      </Routes>
    </Router>
  );
};

export default App;
