import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, useColorMode } from '@chakra-ui/react'


export const ConnectWallet = ({ setwxHOPRBalance, setxHOPRBalance, setBalance }) => {
  const { colorMode } = useColorMode()
  const [web3Modal, setWeb3Modal] = useState();
  const [isLoading, setLoading] = useState(false);

  const bgColor = { light: 'rgb(0, 0, 80, 0.8)', dark: 'rgb(255,255,160,0.8)' }
  const hoverBgColor = { light: 'rgb(0, 0, 80)', dark: 'rgb(255,255,160)' }
  const color = { light: 'white', dark: '#414141' }

  useEffect(() => {
    const loadModal = () => {
      const _web3Modal = new Web3Modal({
        network: "xdai",
        cacheProvider: true,
        providerOptions: {}
      });
      setWeb3Modal(_web3Modal)
    }
    loadModal()
  }, [])

  const handleClick = async() => {
    setLoading(true)
    const xHOPR_TOKEN_ADDRESS = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
    const wxHOPR_TOKEN_ADDRESS = "0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1";
    const tokenAddresses = [xHOPR_TOKEN_ADDRESS, wxHOPR_TOKEN_ADDRESS]

    const web3provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3provider);
    const wallet = provider.getSigner();
    const address = await wallet.getAddress();
    const balance = await provider.getBalance(address);

    const tokenABI = [
      "function balanceOf(address) view returns (uint)",
    ]

    const tokenContracts = tokenAddresses.map(tokenAddress => new ethers.Contract(tokenAddress, tokenABI, provider));
    const [xHOPRBalance, wxHOPRBalance] = await Promise.all(tokenContracts.map(async (contract) => contract.balanceOf(address)))

    console.log('Provider', provider);
    console.log('Wallet', wallet);
    console.log('Address', address);
    setBalance(+ethers.utils.formatEther(balance))
    setxHOPRBalance(+ethers.utils.formatEther(xHOPRBalance))
    setwxHOPRBalance(+ethers.utils.formatEther(wxHOPRBalance))
    setLoading(false)
  }

  return (
    <Button 
      onClick={handleClick} 
      width="100%" 
      variant="solid" 
      variantcolor="green"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      _hover={{ bg: hoverBgColor[colorMode] }}
      isLoading={isLoading}
      >
      Connect Wallet
    </Button>
  )
}