import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListItem,
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { ConnectWallet } from '../components/ConnectWallet'
import { Main } from '../components/Main'
import { TokenInput } from '../components/TokenInput'
import { DarkModeSwitch } from '../components/DarkModeSwitch'


const Index = () => {
  const [balance, setBalance] = useState(0);
  const [xHOPRBalance, setxHOPRBalance] = useState(0);
  const [wxHOPRBalance, setwxHOPRBalance] = useState(0);

  const [web3Modal, setWeb3Modal] = useState();
  const [isLoading, setLoading] = useState(false);
  const [provider, setProvider] = useState();
  const [wallet, setWallet] = useState();
  const [address, setAddress] = useState();

  const xHOPR_TOKEN_ADDRESS = "0xD057604A14982FE8D88c5fC25Aac3267eA142a08";
  const wxHOPR_TOKEN_ADDRESS = "0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1";

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

  const handleTokenSwap = async() => {
    console.log('Swap', balance, wallet, provider);
  }

  //@TODO: Refactor to a proper Web3Context
  const handleConnectWeb3 = async() => {
    setLoading(true)
    
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

    setProvider(provider);
    setWallet(wallet);
    setAddress(address);
    setBalance(+ethers.utils.formatEther(balance))
    setxHOPRBalance(+ethers.utils.formatEther(xHOPRBalance))
    setwxHOPRBalance(+ethers.utils.formatEther(wxHOPRBalance))
    setLoading(false)
  }

  return (<Container height="100vh">
    <Hero />
    <Main>
      <Text>
        Utility to wrap <Code>(xHOPR -> wxHOPR)</Code> and unwrap <Code>(wxHOPR -> xHOPR)</Code> xHOPR tokens.
      </Text>
      <List spacing={3} my={0}>
        <ListItem>
          <TokenInput symbol="_xHOPR" value={xHOPRBalance} setValue={setxHOPRBalance} handleSwap={handleTokenSwap} />
        </ListItem>
        <ListItem>
          <TokenInput symbol="wxHOPR" value={wxHOPRBalance} setValue={setwxHOPRBalance} handleSwap={handleTokenSwap} />
        </ListItem>
      </List>
      <ConnectWallet
        address={address}
        onClick={handleConnectWeb3}
        isLoading={isLoading}
      />
    </Main>
    <DarkModeSwitch />
  </Container>);
}

export default Index
