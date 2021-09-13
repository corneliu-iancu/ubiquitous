import { useMemo, useState } from 'react';

/**
 * Gets user provider or Signer
 *
  ~ Features ~
  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const tx = Transactor(userSigner, gasPrice)
 * @param injectedProviderOrSigner
 * @param localProvider
 * @returns
 */
export const useUserProviderAndSigner = (injectedProviderOrSigner: any, localProvider: any) => {
    const [signer, setSigner] = useState();
    const [provider, setProvider] = useState();
    const [providerNetwork, setProviderNetwork] = useState();
   

    useMemo(() => {
        if (injectedProviderOrSigner) {
            console.log('🦊 Using injected provider');
            void parseProviderOrSigner(injectedProviderOrSigner).then((result: any) => {
                if (result != null)
                    setSigner(result.signer);
            });
        }
        else if (!localProvider) {
            setSigner(undefined);
        }
        else {
            // syncBurnerKeyFromStorage();
            console.log('🔥 No signer could be found.');
            setSigner(undefined);
            // setSigner(burnerSigner);
        }
    }, [injectedProviderOrSigner, localProvider]);
    useMemo(() => {
        if (signer) {
            const result = parseProviderOrSigner(signer);
            void result.then((r: any) => {
                setProvider(r.provider);
                setProviderNetwork(r.providerNetwork);
            });
        }
    }, [signer]);
    return { signer, provider, providerNetwork };
};
    
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

export const parseProviderOrSigner = async (providerOrSigner: any) => {
    let signer = undefined;
    let provider;
    let providerNetwork;
    if (providerOrSigner && (providerOrSigner instanceof JsonRpcProvider || providerOrSigner instanceof Web3Provider)) {
        const accounts = await providerOrSigner.listAccounts();
        if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
        }
        provider = providerOrSigner;
        providerNetwork = await providerOrSigner.getNetwork();
    }
    if (!signer && providerOrSigner instanceof Signer) {
        signer = providerOrSigner;
        provider = signer.provider;
        providerNetwork = provider && (await provider.getNetwork());
    }
    return { signer, provider, providerNetwork };
};
