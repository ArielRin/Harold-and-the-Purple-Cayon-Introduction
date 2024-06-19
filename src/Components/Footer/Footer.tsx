import React, { useEffect, useState } from 'react';
import { Flex, Box, Image, Text, Link } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter as faXTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
  const { open } = useWeb3Modal();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [tokenPrice, setTokenPrice] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setProvider(web3Provider);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch('https://api.geckoterminal.com/api/v2/networks/degenchain/pools/0x401cd27b11e64527cc09bcad1febcf8fcae8e945');
        const data = await response.json();
        console.log('API Response:', data);
        setTokenData(data.data.attributes);
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, []);


  return (
    <footer style={{ backgroundColor: '#68268e', color: 'white', textAlign: 'center', padding: '2px 0', fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}>
      <Box py={4}>

        <Text mb={2}>&copy; {currentYear} Harold and the Purple Crayon.</Text>

                                                                <Flex mb="5px"  mt="5px" justifyContent="center" flexWrap="wrap">
                                                                    <w3m-network-button />
                                                                </Flex>
        <Flex justify="center" align="center" gap={4}>
          <Link href="https://www.degenpurps.xyz/" isExternal>
            <FontAwesomeIcon icon={faGlobe} size="sm" />
          </Link>
          <Link href="https://twitter.com/DegenPurp" isExternal>
            <FontAwesomeIcon icon={faXTwitter} size="sm" />
          </Link>
          <Link href="https://t.me/purpdegen" isExternal>
            <FontAwesomeIcon icon={faTelegram} size="sm" />
          </Link>
        </Flex>
        <Image src="images/footer.png" alt="header" width="220px"  mt="5px" mx="auto" />

      </Box>
    </footer>
  );
};

export default Footer;
