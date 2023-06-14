import '../styles/index.css';
//import { ChainId, DAppProvider, AvlancheTesnet, useEthers, Config } from '@usedapp/core';
import { ChainId, Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli, AvalancheTestnet, Sepolia } from '@usedapp/core'
import { Contract, getDefaultProvider, utils } from 'ethers';
import { formatEther } from '@ethersproject/units';

import 'bootstrap/dist/css/bootstrap.min.css';

// metamask connection imports
import Web3 from 'web3';

function getLibrary(provider, connector) {
    return new Web3(provider);
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

    // change this to switch between Fuji and other networks
    const config = {
        readOnlyChainId: Sepolia.chainId,
        //readOnlyChainId: Mainnet.chainId,
        //readOnlyChainId: Goerli.chainId,
        //readOnlyChainId: AvalancheTestnet.chainId,
        readOnlyUrls: {
            //[Goerli.chainId]: `https://goerli.infura.io/v3/567889545a974330976808f6c98b8eea`,
            //[AvalancheTestnet.chainId]: `https://avalanche-fuji.infura.io/v3/567889545a974330976808f6c98b8eea`,
            [Sepolia.chainId]: `https://eth-sepolia.g.alchemy.com/v2/Ov_IT5t3BmwRPEoueIy-3kT_AeMaJCMw`,
        },
    }

    return (
        // <DAppProvider>
        //     <Component {...pageProps} />
        // </DAppProvider>
        
        // DAppProvider uses useDapp framework, Web3ReactProvider and MetaMaskProvider
        // support connecting to metamask
        <DAppProvider config={config}>
            <Component {...pageProps} />
        </DAppProvider>

    )
}