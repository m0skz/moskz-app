import React from 'react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './abi.json';
import logo from './logo.png';

function App() {
  const contractAddr = '0xe3e1348736D2c76c370A9ef0F6b5b20B7DfD880B';
  const [walletConnect, setWalletConnect] = useState('');
  const [connected, setConnected] = useState(false);
  //const [svg, setSvg] = useState('');
  const [currentSupply, setCurrentSupply] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  const [mintState, setMintState] = useState('');

  const getWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('pls install metamask');
      setWalletConnect('pls install metamask');
    }
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.getNetwork();
      console.log(network.chainId);
      if (network.chainId !== 137) {
        alert('pls set network to polygon mainnet in metamask to continue');
        setWalletConnect('error, pls connect to polygon mainnet in metamask and refresh');
      }
      //var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.send('eth_requestAccounts', []);
      console.log(accounts[0]);
      //var balance = await provider.getBalance(accounts[0]);
      setWalletConnect('Connected with address: ' + accounts[0] + '.');
      setConnected(true);
    } catch(e) {
      alert(e.message);
    }
  }

  //useEffect(() => {
  //  getWallet();
  //}, [])

  useEffect(() => {
    getInfo();
  }, [])

  const connectWalletButton = () => {
    return (
      <button onClick={ getWallet }>
        Connect to wallet
      </button>
    );
  }

  const getInfo = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddr, abi, signer);
    const lastToken = await contract.totalSupply();
    const maxTokens = await contract.maxSupply();
    //const lastSvg = await contract.buildSvg(lastToken);
    //setSvg(lastSvg);
    setCurrentSupply(lastToken);
    setMaxSupply(maxTokens);
  }

  const mintUi = () => {
    try {
      //const buff = new Buffer(svg);
      //const base64data = buff.toString('base64');
      //const imgSrc = 'data:image/svg+xml;base64,' + base64data.toString();
      const cs = currentSupply.toString();
      const ms = maxSupply.toString();
      //console.log(imgSrc);
      console.log(ms);
      console.log(cs);
      return (
        <>
          Current supply: { cs } / { ms }
          <br/><br/>
          <button onClick={ mintSkullz }>Mint</button>
        </>
      );
    } catch (e) {
      alert(e);
      return ( e.message.toString() );
    }
  }

  const mintSkullz = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddr, abi, signer);
      setMintState("Calling Metamask...");
      //const options = { maxFeePerGas: 5000000000, maxPriorityFeePerGas: 5000000000 }
      const options = { gasLimit: 250000, gasPrice: 4000000000 }
      let mintTxn = await contract.mint(options);
      mintTxn.maxFeePerGas = 5;
      mintTxn.maxPriorityFeePerGas = 5;
      setMintState("Minting, pls wait...");
      await mintTxn.wait();
      setMintState('Complete, txn: ' + mintTxn.hash);
    } catch (e) {
      console.log(e.message.toString())
      setMintState(e.message.toString());
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h4>Motley Skullz</h4>
        <p className='smallerTextCenter'>
          A fully on-chain generative vector art project.
        </p>
        <div>
          <img src={ logo } alt="logo"></img>
        </div>
        Free mint on polygon.
        <br/>
        <p>
          { connected ? mintUi() : connectWalletButton() }
        </p>
        <br/>
        <p className='smallerText'>
          { walletConnect }
        </p>
        <p className='mintStatus'>
          { mintState }
        </p>
        <div className='smallerText'>
          <p>
            Motley Skullz are a fully on chain generative collection of vector art.
            This is a public domain project, free mint on Polygon blockchain for all.
          </p>
          <p>
            All skullz have hidden mechanic, can you find what it is? Hint: contract.
          </p>
          <p>
            The contract supports adding traits (eyes, noses, shapes), feel free to reach me on
            twitter, if you have an idea for a trait, or if you are into vector art, send
            seme shapes my way and I'll add them to the contract.
          </p>
          <p>
            If you like the project, any kind of support is greatly appreciated.
          </p>
          <p>
            Contract code verified, website hosted on github pages, feel free to
            reach me on twitter if interested in details or sharing ideas etc :)
          </p>
          <p>
            Note: gas price is set to 4 gwei, with current conditions it works decently
            enough, however, pls override as you see fit in metamask.
          </p>
        </div>
        <a
          className="App-link"
          href="https://opensea.io/collection/motley-skullz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Collection on OpenSea
        </a>
        <br/>
        <a className="App-link"
          href="https://twitter.com/smilingdrag0n"
          target="_blank"
          rel="noopener noreferrer"
        >
          @smilingdrag0n
        </a>
      </header>
    </div>
  );
}

export default App;
