import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import { Box, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';

import Home from './Home';


import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalTheme,
} from '@web3modal/ethers5/react';

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
];
// auth: {
//     email: true, // default to true
//     socials: ['google', 'x', 'github', 'discord', 'apple'],
//     showWallets: true, // default to true
//     walletFeatures: true // default to true
//   },
const ethersConfig = defaultConfig({

  metadata: {
    name: 'Harold and the Purple Crayon ',
    description: '',
    url: 'https://haroldandthepurplecrayon.netlify.app/',
    icons: ['images/favicon.png']
  },
  coinbasePreference: 'smartWalletOnly',
  defaultChainId: 666666666,
  rpcUrl: 'https://rpc-degen-mainnet-1.t.conduit.xyz',
});

createWeb3Modal({
  ethersConfig,
  chains,
  projectId,


  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix-strength': 100,
    // '--w3m-font-family': 'Comic Sans',
    '--w3m-accent': '#8746b5',
    '--w3m-color-mix': '#377ca9'



  },
  chainImages: {
    666666666: 'https://dd.dexscreener.com/ds-data/tokens/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png?size=lg&key=e17c44',

  },

  featuredWalletIds: [
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'
  ]
});

const App = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
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
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
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
      </Routes>
    </Router>
  );
};

export default App;
// https://api.geckoterminal.com/api/v2/simple/networks/degenchain/token_price/0x4306030564ef40d6302dAA9B1Ace580Fe2dfd6c6
