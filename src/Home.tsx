import React, { useState, useEffect } from 'react';
import { Box, Image, Flex, Text, Button, Link } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
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

  const glow = keyframes`
    from {
      box-shadow: 0 0 10px purple;
    }
    to {
      box-shadow: 0 0 20px white, 0 0 30px white, 0 0 40px white, 0 0 50px white;
    }
  `;

  const glowStyle = css`
    animation: ${glow} 1.5s ease-in-out infinite alternate;
  `;

  const formatPrice = (price: string) => parseFloat(price).toFixed(8);
  const usdPrice = (price: string) => {
    return parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const textShadowStyle = css`
    text-shadow: 1px 1px 2px white, 0 0 1em white, 0 0 0.2em white;
  `;

  return (
    <>
      <Box
        position="relative"
        flex={1}
        p={0}
        m={0}
        display="flex"
        flexDirection="column"
        color="white"
      >
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src="/images/bkg2.mp4" type="video/mp4" />
        </video>

          <Flex p="5px" bg="rgba(0, 0, 0, 0.61)" justifyContent="right" flexWrap="wrap">
            <w3m-button />
          </Flex>
        <Box
          flex={1}
          p={0}
          m={0}
          display="flex"
          flexDirection="column"
          bgImage="url('/images/1bkgclear.png')"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          color="white"
        >
          <Flex justifyContent="right" p={2} flexWrap="wrap" position="relative">
            <Image src="images/headinglogo.png" alt="header" width="50%" minW="380px" mt="28px" />
          </Flex>
          <Box
            flex={1}
            p={0}
            m={0}
            display="flex"
            flexDirection="column"
            color="white"
            mb="2px"
          >
            <Flex mt="250px" justifyContent="right" p={2} flexWrap="wrap" position="relative">
              {tokenData && (
                <Box fontSize="4xl" color="purple" fontFamily="Comic Sans MS, Comic Sans, cursive" css={textShadowStyle}>
                  <Text  fontWeight="bolder"  textAlign="right">$PURP: {formatPrice(tokenData.base_token_price_usd)}</Text>
                  <Text  fontWeight="bolder"  textAlign="right">Market Cap: ${usdPrice(tokenData.fdv_usd)}</Text>
                  <Text fontWeight="bolder" textAlign="right">Liquidity: ${usdPrice(tokenData.reserve_in_usd)}</Text>
                </Box>
              )}
            </Flex>
            <Flex p={6} justifyContent="right">
              <Link href="https://dex.swapdegen.tips/#/swap?outputCurrency=0x4306030564ef40d6302dAA9B1Ace580Fe2dfd6c6" isExternal>
                <Button
                  size="lg"
                  colorScheme="purple"
                  variant="solid"
                  fontSize="2xl"
                  fontFamily="Comic Sans MS, Comic Sans, cursive"
                  css={glowStyle}
                >
                  Buy Now
                </Button>
              </Link>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
