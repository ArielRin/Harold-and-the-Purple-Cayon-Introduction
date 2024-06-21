import React, { useEffect, useState, useContext } from 'react';
import BnbPriceContext from './BnbPriceContext';
import tokenAbi from './tokenAbi.json';
import referralAbi from './referralSwapperAbi.json';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Link as ChakraLink,
  Flex,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Spacer,
  Tab,
  TabPanel,
  Input,
  Button,
  Text,
  Image,
  useToast,
  Collapse,
} from "@chakra-ui/react";
import { ethers } from 'ethers';

const TOKEN_CONTRACT_ADDRESS = "0x4306030564ef40d6302dAA9B1Ace580Fe2dfd6c6";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0x401cD27B11e64527Cc09bCAD1feBCF8fCAe8e945";
const REFERRAL_CONTRACT_ADDRESS = "0x8F48161234E345336D014c6e050341Acc93Af433";

const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/Harold-and-the-Purple-Cayon-Introduction/master/public/images/PURP.png?token=GHSAT0AAAAAACTIS45UOJT4CTQNQRO7PIKAZTUDIUQ';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';

const contractOptions = {
  "Choose a Referral to Support": "0x8F48161234E345336D014c6e050341Acc93Af433",
  "Referral 2": "0x2E6f4827dbBa6A00789b5A0244b7623f3557810c",
  "Referral 3": "0x5C2491F1d2dDC595359ab81BeC44EA3f603AbfCb",
  "Referral 4": "0x5858D802a2a3aDdcd0A8431ECc7526A9Dd298A18",
};

declare global {
  interface Window {
    ethereum: any;
  }
}

const FastSwapComponent = () => {
  const bnbPrice = useContext(BnbPriceContext);
  const [userAddress, setUserAddress] = useState('');
  const [alpha7TokenBalance, setAlpha7TokenBalance] = useState('0.0000');
  const [bnbBalance, setBnbBalance] = useState('0.0000');
  const [developerTokenBalance, setDeveloperTokenBalance] = useState('0.0000');
  const [treasuryTokenBalance, setTreasuryTokenBalance] = useState('0.0000');
  const [developerBNBBalance, setDeveloperBNBBalance] = useState('0.0000');
  const [treasuryBNBBalance, setTreasuryBNBBalance] = useState('0.0000');
  const [alpha7LPTokenSupply, setAlpha7LPTokenSupply] = useState('0.0000');
  const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');
  const [selectedContract, setSelectedContract] = useState(contractOptions["Choose a Referral to Support"]);
  const [selectedReferrer, setselectedReferrer] = useState(contractOptions["Choose a Referral to Support"]);
  const [connectedWalletLPTokenBalance, setConnectedWalletLPTokenBalance] = useState('0.0000');
  const [developerWalletLPTokenBalance, setDeveloperWalletLPTokenBalance] = useState('0.0000');
  const [nftTreasuryWalletLPTokenBalance, setNftTreasuryWalletLPTokenBalance] = useState('0.0000');

  const addTokenToWallet = async () => {
    try {
      if (window.ethereum) {
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: TOKEN_CONTRACT_ADDRESS,
              symbol: 'PURP',
              decimals: 18,
              image: tokenLogoUrl,
            },
          },
        });

        if (wasAdded) {
          console.log('Token was added to wallet!');
        } else {
          console.log('Token was not added to wallet.');
        }
      } else {
        console.log('Ethereum provider (e.g., MetaMask) not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-degen-mainnet-1.t.conduit.xyz');
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const fetchBNBBalance = async (walletAddress: string) => {
          const balanceWei = await provider.getBalance(walletAddress);
          return parseFloat(ethers.utils.formatEther(balanceWei)).toFixed(4);
        };

        setBnbBalance(await fetchBNBBalance(address));
        setDeveloperBNBBalance(await fetchBNBBalance(DEVELOPER_WALLET_ADDRESS));
        setTreasuryBNBBalance(await fetchBNBBalance(TREASURY_WALLET_ADDRESS));

        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
        const balance = await tokenContract.balanceOf(address);
        setAlpha7TokenBalance(parseFloat(ethers.utils.formatUnits(balance, 9)).toFixed(0));

        const developerBalance = await tokenContract.balanceOf(DEVELOPER_WALLET_ADDRESS);
        const treasuryBalance = await tokenContract.balanceOf(TREASURY_WALLET_ADDRESS);
        setDeveloperTokenBalance(parseFloat(ethers.utils.formatUnits(developerBalance, 9)).toFixed(0));
        setTreasuryTokenBalance(parseFloat(ethers.utils.formatUnits(treasuryBalance, 9)).toFixed(0));

        const alpha7LPContract = new ethers.Contract(ALPHA7_LP_TOKEN_ADDRESS, tokenAbi, provider);
        const lpTokenSupply = await alpha7LPContract.totalSupply();
        const formattedLPSupply = parseFloat(ethers.utils.formatUnits(lpTokenSupply, 18)).toFixed(6);
        setAlpha7LPTokenSupply(formattedLPSupply);
      }
    };

    fetchWalletDetails();
  }, []);

  const [bnbPriceInUSD, setBnbPriceInUSD] = useState('');

  useEffect(() => {
    const fetchBnbPrice = async () => {
      const apiUrl = 'https://api.geckoterminal.com/api/v2/simple/networks/degenchain/token_price/0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387'; // Replace this with the actual URL
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const bnbPrice = data.data.attributes.token_prices['0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387'];
        setBnbPriceInUSD(bnbPrice);
      } catch (error) {
        console.error('Failed to fetch DEGEN price:', error);
      }
    };

    fetchBnbPrice(); // Call the function to fetch DEGEN price
  }, []);

  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/degenchain/tokens/0x4306030564ef40d6302dAA9B1Ace580Fe2dfd6c6`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const attributes = data?.data?.attributes;

        if (attributes) {
          const { fdv_usd, total_reserve_in_usd, price_usd } = attributes;

          setMarketCap(fdv_usd ? `$${parseFloat(fdv_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Market Cap not available');
          setTotalReserveInUSD(total_reserve_in_usd ? `${parseFloat(total_reserve_in_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Total Reserve not available');
          setTokenPriceUSD(price_usd ? `${price_usd}` : 'Price not available');
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
          setTokenPriceUSD('Price not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
        setTokenPriceUSD('Error fetching price');
      });
  }, []);

  const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('Loading...');
  const [totalReserveInUSD, setTotalReserveInUSD] = useState('Loading...');
  const [marketCap, setMarketCap] = useState('Loading...');

  useEffect(() => {
    if (totalReserveInUSD !== 'Loading...' && totalReserveInUSD !== 'Total Reserve not available' && totalReserveInUSD !== 'Error fetching data') {
      const reserveValue = Number(totalReserveInUSD.replace(/[^0-9.-]+/g, ""));
      const liquidityValue = reserveValue * 2;
      setTotalLiquidityUSD(`${liquidityValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`);
    }
  }, [totalReserveInUSD]);

  const [lpTokenValue, setLpTokenValue] = useState('Loading...');
  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/degenchain/tokens/${TOKEN_CONTRACT_ADDRESS}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const attributes = data?.data?.attributes;

        if (attributes) {
          setMarketCap(attributes.fdv_usd ? `$${parseFloat(attributes.fdv_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Market Cap not available');
          setTotalReserveInUSD(attributes.total_reserve_in_usd ? `${parseFloat(attributes.total_reserve_in_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Total Reserve not available');
          setTokenPriceUSD(attributes.price_usd ? `${attributes.price_usd}` : 'Price not available');

          const reserveNumeric = parseFloat(attributes.total_reserve_in_usd);
          const supplyNumeric = parseFloat(alpha7LPTokenSupply);
          if (!isNaN(reserveNumeric) && !isNaN(supplyNumeric) && supplyNumeric > 0) {
            setLpTokenValue((reserveNumeric / supplyNumeric).toFixed(8));
          } else {
            setLpTokenValue('Calculation error');
          }
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
          setTokenPriceUSD('Price not available');
          setLpTokenValue('Data not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
        setTokenPriceUSD('Error fetching price');
        setLpTokenValue('Error fetching data');
      });
  }, [alpha7LPTokenSupply]);

  useEffect(() => {
    const fetchLPTokenBalances = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-degen-mainnet-1.t.conduit.xyz');
        const signer = provider.getSigner();
        const alpha7LPContract = new ethers.Contract(ALPHA7_LP_TOKEN_ADDRESS, tokenAbi, signer);

        const connectedWalletAddress = await signer.getAddress();
        const connectedWalletLPBalance = await alpha7LPContract.balanceOf(connectedWalletAddress);
        setConnectedWalletLPTokenBalance(ethers.utils.formatUnits(connectedWalletLPBalance, 18));

        const developerWalletLPBalance = await alpha7LPContract.balanceOf(DEVELOPER_WALLET_ADDRESS);
        setDeveloperWalletLPTokenBalance(ethers.utils.formatUnits(developerWalletLPBalance, 18));

        const nftTreasuryWalletLPBalance = await alpha7LPContract.balanceOf(TREASURY_WALLET_ADDRESS);
        setNftTreasuryWalletLPTokenBalance(ethers.utils.formatUnits(nftTreasuryWalletLPBalance, 18));
      }
    };

    fetchLPTokenBalances();
  }, []);

  const [amountToSend, setAmountToSend] = useState('');

  const sendEther = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-degen-mainnet-1.t.conduit.xyz');
        const signer = provider.getSigner();
        const transactionResponse = await signer.sendTransaction({
          to: selectedContract,
          value: ethers.utils.parseEther(amountToSend || "0")
        });
        await transactionResponse.wait();
        alert('DEGEN sent successfully');
      } else {
        alert('Your wallet is not connected');
      }
    } catch (error) {
      console.error('Error sending DEGEN:', error);
      alert('Error sending DEGEN');
    }
  };

  const calculateTokensReceived = () => {
    const numericAmountToSend = parseFloat(amountToSend) || 0;
    const numericBnbPrice = bnbPrice ?? 0;
    const bnbValueUSD = (numericAmountToSend * numericBnbPrice).toFixed(2);
    const numericTokenPriceUSD = parseFloat(tokenPriceUSD) || 0;
    if (numericAmountToSend === 0 || numericBnbPrice === 0 || numericTokenPriceUSD === 0) {
      return 0;
    }

    const tokensBeforeFee = parseFloat(bnbValueUSD) / numericTokenPriceUSD;
    const feeDeduction = tokensBeforeFee * 0.056;
    const tokensAfterFee = tokensBeforeFee - feeDeduction;

    return isNaN(tokensAfterFee) ? 0 : tokensAfterFee;
  };

  const calculateUSDValueOfTokens = () => {
    const tokens = calculateTokensReceived();
    return (tokens * parseFloat(tokenPriceUSD)).toFixed(2);
  };

  const handleContractChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.value as keyof typeof contractOptions;
    setSelectedContract(contractOptions[key]);
  };

  const handleContractChangeName = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.value as keyof typeof contractOptions;
    setselectedReferrer(contractOptions[key]);
  };

  const logoSize = '27px';

  return (
    <>
      <div style={{ width: '380px', backgroundColor: 'rgba(84, 104, 152, 1)', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="images/friends.png" alt="DegenSwap Logo" style={{ display: 'block', margin: '0 auto', width: '370px' }} />

        <div style={{ width: '380px', backgroundColor: 'rgba(84, 104, 152, 1)', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1px', color: 'white' }}>
            <img src="https://dd.dexscreener.com/ds-data/tokens/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png?size=lg&key=e17c44" alt="DEGEN Logo" style={{ width: "50px", height: "50px" }} />
            <Text fontSize="xl" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' ,  marginLeft: '10px' }}>DEGEN</Text>
            <div style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' , marginLeft: 'auto' }}>
              <span>Balance: {bnbBalance}</span>
            </div>
          </div>
          <input
            type="text"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
            placeholder="Enter amount to send (DEGEN)"
            style={{  textAlign: 'right',   fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' ,  width: '100%', margin: '5px 0', padding: '10px', color: 'purple', backgroundColor: 'rgba(151, 178, 234, 1.0)', border: '1px solid purple', borderRadius: '4px' }}
          />
          <small style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' , alignSelf: 'flex-end', color: '#fff', marginBottom: '20px' }}>
            DEGEN value USD: ${isNaN(parseFloat(amountToSend) * (bnbPrice ?? 0)) ? "0.00" : (parseFloat(amountToSend) * (bnbPrice ?? 0)).toFixed(2)}
          </small>
          <div style={{ width: '380px', backgroundColor: 'rgba(61, 79, 108, 0.0)', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.0)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1px', color: 'white' }}>
              <img src="images/PURP.png" alt="PURP Logo" style={{ width: "50px", height: "50px" }} />
              <Text fontSize="xl" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' , marginLeft: '10px' }}>PURP</Text>
              <div style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' , marginLeft: 'auto' }}>
                <span>Balance: {alpha7TokenBalance}</span>
              </div>
            </div>
            <input
              readOnly
              value={calculateTokensReceived().toFixed(2) + ' '}
              placeholder="Enter amount to send (DEGEN)"
              style={{ textAlign: 'right',  fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' , width: '100%', margin: '5px 0', padding: '10px', color: 'purple', backgroundColor: 'rgba(151, 178, 234, 1.0)', border: '3px solid purple', borderRadius: '4px' }}
            />
            <small style={{fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' , alignSelf: 'flex-end', color: '#fff', marginBottom: '0px' }}>
              PURP Token value USD: ${isNaN(calculateTokensReceived() * parseFloat(tokenPriceUSD)) ? "0.00" : (calculateTokensReceived() * parseFloat(tokenPriceUSD)).toFixed(2)}
            </small>
          </div>
          <button onClick={sendEther} style={{ width: '100%', padding: '10px 20px', marginTop: '0px', backgroundColor: 'purple', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <img src="favicon.png" alt="DegenSwap Logo" style={{ width: '47px', height:'47px', marginRight: '20px' }} />
            <span style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' }}>Get Some $PURP Now!</span>
          </button>
          <a href="https://dex.swapdegen.tips/?outputCurrency=0x4306030564ef40d6302daa9b1ace580fe2dfd6c6#/swap" target="_blank" rel="noopener noreferrer" style={{ width: '100%', padding: '5px 25px', marginTop: '0px', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textDecoration: 'none' }}>
            <img src="images/degenswap.png" alt="Wallet Icon" style={{ width: "18px", height: "27px", marginRight: '8px' }} />
            <span style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' }}>or Buy PURP at Degen Swap</span>
          </a>
          <a onClick={addTokenToWallet} style={{ width: '100%',  color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '5px 25px', justifyContent: 'flex-start', textDecoration: 'none' }}>
            <img src="images/PURP.png" alt="PURP Logo" style={{ width: "22px", height: "22px", marginRight: '8px' }} />
            <span style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' }}>Add $PURP Token to Wallet</span>
          </a>
          <a href="https://explorer.degen.tips/address/0x4306030564ef40d6302dAA9B1Ace580Fe2dfd6c6" target="_blank" rel="noopener noreferrer" style={{ width: '100%', padding: '5px 25px', marginTop: '0px', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textDecoration: 'none' }}>
            <img src="images/explorer.svg" alt="Wallet Icon" style={{ width: "80px", height: "28px", marginRight: '8px' }} />
            <span style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold' }}>Explorer</span>
          </a>
        </div>
      </div>
      <Flex p="5px" bg="rgba(0, 0, 0, 0)" justifyContent="left" flexWrap="wrap">
        <w3m-button />
      </Flex>
    </>
  );
};

export default FastSwapComponent;
