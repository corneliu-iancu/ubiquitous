import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { NETWORKS, SITE_PREFERENCES } from '../config/constants'
import { Navigation } from "../components/Navigation"
import { useContractConfig } from '../hooks/useContractConfig';
import * as ethers from 'ethers'
import Web3Modal from "web3modal";

import { useUserProviderAndSigner } from '../hooks/useUserProviderAndSigner';

const DEBUG : boolean = false

const targetNetwork = NETWORKS.localhost

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;

// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;

// if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

let web3Modal : any;
if (process.browser) {
  web3Modal = new Web3Modal({
    // network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
    cacheProvider: true, // optional
    theme: "light" // optional. Change to "dark" for 
  })
}

export default function Mint() {
    const pageTitle : string = "Create your own NFT";
    const contractConfig = useContractConfig();
    const [injectedProvider, setInjectedProvider] = useState<any | undefined>()
    const [address, setAddress] = useState()
    // we will try to pull in the user address.
    
    const userProviderAndSigner: any = useUserProviderAndSigner(injectedProvider, localProvider);
    const userSigner = userProviderAndSigner.signer;

    
    useEffect(() => {
      async function getAddress() {
        if (userSigner) {
          const newAddress = await userSigner.getAddress();
          console.log(newAddress);
          setAddress(newAddress);
        }
      }
      getAddress();
    }, [userSigner])
    
    // // we need to inject a web3 privider
    const loadWeb3Modal = useCallback(async () => {
      console.debug("Load web3 modal.")
      const provider = await web3Modal.connect();
      setInjectedProvider(new ethers.providers.Web3Provider(provider));

      provider.on("chainChanged", (chainId : number) => {
        console.log(`chain changed to ${chainId}! updating providers`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });
  
      provider.on("accountsChanged", () => {
        console.log(`account changed!`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });
  
      // Subscribe to session disconnection
      provider.on("disconnect", (code: any, reason: any) => {
        console.log(code, reason);
        // logoutOfWeb3Modal();
      });

    }, [setInjectedProvider])

    useEffect(() => {
      if (web3Modal.cachedProvider) {
        loadWeb3Modal();
      }
    }, [loadWeb3Modal]);

    return (
      <>
        <Head>
            <title>{ SITE_PREFERENCES.SITE_TITLE + ' - ' + pageTitle }</title>
        </Head>
        <Navigation items={['Market', 'Mint','Account']} />
       
        <header className="text-2xl px-4 py-4">
          <h2>Mint</h2>
          { !address && ( 
            <p  onClick={loadWeb3Modal} >Connect wallet</p>
          )}
          {address && (
            <label>{ address }</label>
          )}
        </header>
        <form className="text-sm px-4">
          <section>
              <label>Create new item</label>
              <header>
                <h3>Image, Video, Audio, or 3D Model</h3>
                <p>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 40 MB</p>
              </header>
              <div>
                <input type="file" />
              </div>
          </section>
          <section>
              <label>Name *</label>
              <div>
                <input type="text" />
              </div>
          </section>
          <section>
              <label>Description *</label>
              <div>
                <textarea />
              </div>
          </section>
          <section>
              <label>Supply</label>
              <div>
                <input type="number" disabled />
              </div>
          </section>        
          <div>
            <input type="submit" className="button" />
          </div>
        </form>
      </>
    )
}