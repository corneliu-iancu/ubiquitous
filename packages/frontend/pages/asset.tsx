import { useState, useEffect, useCallback } from 'react'
import { ethers, providers, utils } from 'ethers'
import axios from 'axios'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { NftContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import NftContract from '../artifacts/contracts/NftContract.sol/NftContract.json'
import { NftContract as NftContractType } from '../types/typechain'
import { Layout } from '../components/layout/Layout'

const localProvider = new providers.StaticJsonRpcProvider(
    'http://localhost:8545'
)

const ROPSTEN_CONTRACT_ADDRESS = '0x000'


function NFT(): JSX.Element {
    const { account, chainId, library } = useEthers()
    const [ assets, setAssets ] = useState<any>([])
    
    // console.log(library)

    const CONTRACT_ADDRESS = chainId === ChainId.Ropsten
      ? ROPSTEN_CONTRACT_ADDRESS
      : LOCAL_CONTRACT_ADDRESS

    

      useEffect(() => {
        async function loadNFTs() {
            if (!library) {
                // console.error(' Connection not available.')
                return
            }
            // console.log('🐳 >> loading nfts.')
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                NftContract.abi,
                library
            ) as NftContractType
                
            let data = await contract.tokensOfOwner(account)

            const items = await Promise.all(data.map(async i => {
                const tokenUri = await contract.tokenURI(i.toNumber())
                const meta = await axios.get(tokenUri)
                return meta.data;
            }))
            setAssets(items)
        }
        loadNFTs()
    }, [library])

    return (
        <Layout>
            NFT PAGE
            <div className="grid grid-cols-3 gap-4">
                { assets && assets.map((nft, i) => (
                    <div key={i} className="shadow rounded">
                        <div>
                            <img className="object-cover h-48 w-full" src={nft.image} alt="" />
                        </div>
                        <footer className="px-4 py-4">
                            <p className="mb-2"><b>{ nft.name }</b></p>
                            <p><em>{ nft.description }</em></p>
                            {/* <p>{ nft.external_url }</p> */}
                        </footer>
                    </div>
                ))}
            </div>

        </Layout>
    )
}

export default NFT