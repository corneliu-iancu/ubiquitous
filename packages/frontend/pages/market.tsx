import { ethers, providers, utils } from 'ethers'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { Layout } from '../components/layout/Layout'
import { MarketContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import MarketContract from '../artifacts/contracts/MarketContract.sol/MarketContract.json'
import { MarketContract as MarketContractType } from '../types/typechain'

const localProvider = new providers.StaticJsonRpcProvider(
    'http://localhost:8545'
)

const ROPSTEN_CONTRACT_ADDRESS = '0x000'

function MarketIndex(): JSX.Element {
    const { account, chainId, library } = useEthers()

    const CONTRACT_ADDRESS =
    chainId === ChainId.Ropsten
      ? ROPSTEN_CONTRACT_ADDRESS
      : LOCAL_CONTRACT_ADDRESS

    async function getMarket() {
        if (library) {
            // console.log("Getting market info.")
            const contract = new ethers.Contract(
              CONTRACT_ADDRESS,
              MarketContract.abi,
              library
            ) as MarketContractType

            try {
              const data = await contract.participants();
              console.log(data.toNumber())

              // console.log(utils.parseBytes32String(data))
              // dispatch({ type: 'SET_GREETING', greeting: data })
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log('Error: ', err)
            }
          }
    }

    return (
        <Layout>
            hello market.
            <button
                onClick={() => getMarket()}
                >getMarket</button>
        </Layout>
    )
}

export default MarketIndex