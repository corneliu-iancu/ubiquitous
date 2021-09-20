import { ethers, providers, utils } from 'ethers'
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

    const CONTRACT_ADDRESS =
    chainId === ChainId.Ropsten
      ? ROPSTEN_CONTRACT_ADDRESS
      : LOCAL_CONTRACT_ADDRESS

    async function loadNFTs() {
        if (!library) {
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
            console.log('TokenId:', i.toNumber(), tokenUri)
        }))

        //console.log("Getting market info.", data)
    }

    loadNFTs()

    return (
        <Layout>
            NFT PAGE


        </Layout>
    )
}

export default NFT