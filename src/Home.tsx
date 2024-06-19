import React, { useState, useEffect } from 'react';
import { Box, Image, Flex, Text } from '@chakra-ui/react';
import Footer from './Components/Footer/Footer';

const HomePage = () => {
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
    <>
      <Flex bg="rgba(108, 47, 146, 1)" justifyContent="right" flexWrap="wrap">
        <w3m-button />
      </Flex>
      <Box
        flex={1}
        p={0}
        m={0}
        display="flex"
        flexDirection="column"
        bg="rgba(0, 0, 0, 1)"
        bgImage="url('/images/1bkg.png')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        color="white"
      >
        <Box
          flex={1}
          p={0}
          m={0}
          display="flex"
          flexDirection="column"
          bg="rgba(0, 0, 0, 0)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          color="white"
        >
          <Flex justifyContent="right" p={2} mt="50px" flexWrap="wrap" position="relative">
            {tokenData && (
              <Box fontSize="3xl" color="purple" fontFamily="Comic Sans MS, Comic Sans, cursive">
                <Text>$PURP: {tokenData.base_token_price_usd}</Text>
              </Box>
            )}
          </Flex>
          <Flex justifyContent="right" p={2} flexWrap="wrap" position="relative">
            <Image src="images/headinglogo.png" alt="header" width="50%" minW="380px" mt="28px" />
          </Flex>
          <Box
            flex={1}
            p={0}
            m={0}
            display="flex"
            flexDirection="column"
            bg="rgba(0, 0, 0, 0)"
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            color="white"
            mb="300px"
          >
            <Flex justifyContent="right" p={2} flexWrap="wrap" position="relative">
              {tokenData && (
                <Box fontSize="3xl" color="purple" fontFamily="Comic Sans MS, Comic Sans, cursive">
                  <Text textAlign="right">Market Cap: ${tokenData.fdv_usd}.00</Text>
                  <Text textAlign="right">Liquidity: ${tokenData.reserve_in_usd}</Text>
                </Box>
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
