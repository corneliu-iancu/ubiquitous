import { useEffect, useState } from 'react'
import { ethers, providers, utils } from 'ethers'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { Layout } from '../components/layout/Layout'
import { NftContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import NftContract from '../artifacts/contracts/NftContract.sol/NftContract.json'
import { NftContract as NftContractType } from '../types/typechain'
import { HydraExchange as LOCAL_MARKET_CONTRACT } from '../artifacts/contracts/contractAddress'
import HydraExchange from '../artifacts/contracts/Exchange.sol/HydraExchange.json';
import { HydraExchange as MarketPlaceType } from '../types/typechain'
import axios from 'axios'

const localProvider = new providers.StaticJsonRpcProvider(
    'http://localhost:8545'
)

const ROPSTEN_CONTRACT_ADDRESS = '0x000'

function MarketIndex(): JSX.Element {
    const { account, chainId, library } = useEthers()

    const [marketItems, setMarketItems] = useState<any>([])

    const CONTRACT_ADDRESS = chainId === ChainId.Ropsten
        ? ROPSTEN_CONTRACT_ADDRESS
        : LOCAL_MARKET_CONTRACT

    async function getMarket() {
        if (library) {
            const marketplace = new ethers.Contract(
                CONTRACT_ADDRESS,
                HydraExchange.abi,
                library
            ) as MarketPlaceType
              
            const contract = new ethers.Contract(
                LOCAL_CONTRACT_ADDRESS, // NFT Address.
                NftContract.abi,
                library
            ) as NftContractType

            const data = await marketplace.getMarketItems()
            const items = await Promise.all(data.map(async i => {
                //console.log(i)
                const tokenUri = await contract.tokenURI(i.tokenId.toNumber())
                const { data } = await axios.get(tokenUri);

                return {
                  price: i.price.toNumber(),
                  seller: i.seller,
                  meta: data 
                };
            }))

            setMarketItems(items);
        }
    }

    useEffect(() => {
      if(library)
        getMarket()
    }, [library])

    return (
        <Layout>
            <h2 className="text-4xl mb-3">Marketplace</h2>

            { marketItems && (
              <div className="grid grid-cols-3 gap-4">
                { marketItems.map( listing =>  (
                    <div key={listing} className="shadow rounded">
                        <div>
                            <img className="object-cover h-48 w-full" src={listing.meta.image} alt="" />
                        </div>
                        <footer className="px-4 py-4">
                            <p className="mb-2"><b>{ listing.meta.name }</b></p>
                            <p><em>{ listing.meta.description }</em></p>
                            {/* <button onClick={(evt) => createListing(nft)} className="btn mt-5">Create listing</button> */}
                            {/* <p>{ nft.external_url }</p> */}
                        </footer>
                        {/* { JSON.stringify(listing) } */}
                        {/* <p>{ listing.meta.name }</p> */}
                        {/* <p>{ listing.price } ETH</p> */}
                    </div>
                ))}
              </div>
            )}
            {/* <button
                className="btn"
                onClick={() => getMarket() }
                >getMarket</button> */}
        </Layout>
    )
}

export default MarketIndex