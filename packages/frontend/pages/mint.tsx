import { useState } from 'react'
import { ethers, providers, utils } from 'ethers'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { Layout } from '../components/layout/Layout'

import { NftContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import NftContract from '../artifacts/contracts/NftContract.sol/NftContract.json'
import { NftContract as NftContractType } from '../types/typechain'

import { create } from 'ipfs-http-client'

const client = create({ 
    url: "https://ipfs.infura.io:5001/api/v0"
})


/**
 * Constants & Helpers
 */
const localProvider = new providers.StaticJsonRpcProvider(
    'http://localhost:8545'
)
const ROPSTEN_CONTRACT_ADDRESS = '0x6b61a52b1EA15f4b8dB186126e980208E1E18864'
  

function MintNFT(): JSX.Element {
    const { account, chainId, library } = useEthers()
    const [formInput, updateFormInput] = useState({ name: '', description: '', external_link: '' })
    const [fileUrl, updateFileUrl] = useState('')

    const CONTRACT_ADDRESS =
        chainId === ChainId.Ropsten
        ? ROPSTEN_CONTRACT_ADDRESS
        : LOCAL_CONTRACT_ADDRESS
    // Use the localProvider as the signer to send ETH to our wallet
    const { sendTransaction } = useSendTransaction({
        signer: localProvider.getSigner(),
    })
    
    async function mintNft() {
        if (!library) {
            console.debug("No lib available.")
            return
        }

        const signer = library.getSigner()
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            NftContract.abi,
            signer
        ) as NftContractType

        const metaData = {
            "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
            "external_url": "https://openseacreatures.io/3", 
            "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
            "name": "Dave Starbelly",
            "attributes": [], 
        }

        const transaction = await contract.createToken(JSON.stringify(metaData))
        
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]

        console.log("Token:", value.toNumber());
    }

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }  
    }

    return (
        <Layout>
            <div>Mint nft</div>
            
            <section>
                <input 
                    onChange={ onChange }
                    type="file" name="Upload your NFT media" />
            </section>

            {
                fileUrl && (
                <section>
                    <img src={fileUrl} width="300px" />
                </section>
                )
            }

            <section>
                <input 
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    type="text" name="Item Name" placeholder="Item Name" />
            </section>

            <section>
                <input type="text" name="External Link" placeholder="External Link" />
            </section>

            <section>
                <textarea name="description" placeholder="Provide a detailed description of your item." rows={4}></textarea>
            </section>

            <section>
                <label htmlFor="unlockable-content">Unlockable Content</label>
                <input type="checkbox" id="unlockable-content" name="Unlockable Content" />
                <div><textarea rows={4} /></div>
            </section>

            <section>
                <label htmlFor="sensitive-content">Sensitive Content</label>
                <input type="checkbox" id="sensitive-content" name="Sensitive Content" />
            </section>

            <button onClick={() => mintNft()} className="btn border">
                Mint.
            </button>
        </Layout>
    )
}

export default MintNFT