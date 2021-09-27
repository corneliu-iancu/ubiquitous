import { useState } from 'react'
import { ethers, providers, utils } from 'ethers'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { Layout } from '../components/layout/Layout'

import { NftContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import NftContract from '../artifacts/contracts/NftContract.sol/NftContract.json'
import { NftContract as NftContractType } from '../types/typechain'

import { create, CID } from 'ipfs-http-client'

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
    const [formInput, updateFormInput] = useState({ name: '', description: '', external_url: '' })
    const [fileUrl, updateFileUrl] = useState('')
    const [unlockableContent, setUnlockableContent] = useState(false)

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
            "description": formInput.description, // "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
            "external_url": formInput.external_url ,//"https://openseacreatures.io/3", 
            "image": fileUrl, //"https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
            "name": formInput.name, //"Dave Starbelly",
            "attributes": [], 
        }

        const doc = JSON.stringify(metaData)

        const added = await client.add(doc)
        const url = `https://ipfs.infura.io/ipfs/${added.path}`

        const transaction = await contract.createToken(url)
        
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

    // Temporary form validation untill
    // we implement formik & yup
    function isFormValid() {
        if(!formInput.name || !formInput.description || !fileUrl) {
            return false
        }

        return true
    }

    return (
        <Layout>
            <div>Mint nft</div>
            
            <section className="py-2">
                <div className="input-file-wrapper">
                    <div>
                        <header>Drag & drop a file</header>
                        <p>or browse media on yer device</p>
                    </div>
                    <input 
                        className="input input-file"
                        onChange={ onChange }
                        type="file" name="Upload your NFT media" />
                </div>
            </section>

            {
                fileUrl && (
                <section className="py-2">
                    <img src={fileUrl} width="300px" />
                </section>
                )
            }

            <section className="py-2">
                <input 
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    className="input"
                    type="text" name="Item Name" placeholder="Item Name" />
            </section>

            <section className="py-2">
                <input 
                    className="input"
                    onChange={e => updateFormInput({ ...formInput, external_url: e.target.value })}
                    type="text" name="External Link" placeholder="External Link" />
            </section>

            <section className="py-2">
                <textarea 
                    className="input"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    name="description" placeholder="Provide a detailed description of your item." rows={4}></textarea>
            </section>

            <section className="py-2">
                <label htmlFor="unlockable-content">Unlockable Content</label>
                <input 
                    onChange={ e => setUnlockableContent(e.target.checked) }
                    type="checkbox" id="unlockable-content" name="Unlockable Content" />
                {unlockableContent && (
                    <div>
                        <textarea
                            className="input"
                            name="Unlockable Content"
                            placeholder="Enter content (access keys, promo codes, link to files, etc."
                            rows={4} />
                    </div>
                )}
            </section>

            <section className="py-2">
                <label htmlFor="sensitive-content">Sensitive Content</label>
                <input type="checkbox" id="sensitive-content" name="Sensitive Content" />
            </section>

            <button onClick={() => mintNft()} 
                disabled={!isFormValid()}
                className="btn">
                Mint
            </button>
        </Layout>
    )
}

export default MintNFT