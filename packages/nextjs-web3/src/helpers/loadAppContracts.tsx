import contractListPromise from "../contracts/hardhat_contracts.json"

export const loadAppContracts = async () => {
    const result = await contractListPromise;
    const config : any = {}
    config.deployedContracts = result ?? {}
    return config
}