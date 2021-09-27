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

    

    useCallback( async () => {
        async function loadNFTs() {
            if (!library) {
                console.log('nu lib')
                return
            }
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                NftContract.abi,
                library
            ) as NftContractType
                
            let data = await contract.tokensOfOwner(account)
            const items = await Promise.all(data.map(async i => {
                const tokenUri = await contract.tokenURI(i.toNumber())
                //console.log('TokenId:', i.toNumber(), tokenUri)
                const meta = await axios.get(tokenUri)
                return meta.data;
            }))
            setAssets(items)
        }
        loadNFTs()
    }, [])

    return (
        <Layout>
            NFT PAGE
            <div>
                { assets && assets.map((nft, i) => (
                    <div key={i}>
                        <p>{ nft.name }</p>
                        <p>{ nft.description }</p>
                        <p>{ nft.external_url }</p>
                        <p>{ nft.image }</p>
                    </div>
                ))}
            </div>

        </Layout>
    )
}

export default NFT