import "../styles/index.css";
import { DAppProvider, Sepolia } from "@usedapp/core";
import {
  accounts_abi,
  auctions_abi,
  accountsAddress,
  auctionsAddress,
} from "../config";
import { Contract, utils } from "ethers";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import "bootstrap/dist/css/bootstrap.min.css";

// setup contract instances
export const ACCOUNT_ABI = new utils.Interface(accounts_abi);
export const AUCTION_ABI = new utils.Interface(auctions_abi);
export const ACCOUNT_INSTANCE = new Contract(accountsAddress, ACCOUNT_ABI);
export const AUCTION_INSTANCE = new Contract(auctionsAddress, AUCTION_ABI);

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
      [Sepolia.chainId]: `https://sepolia.infura.io/v3/567889545a974330976808f6c98b8eea`,
    },
  };

  return (
    // DAppProvider uses useDapp framework, Web3ReactProvider and MetaMaskProvider
    // support connecting to metamask
    <DAppProvider config={config}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </DAppProvider>
  );
}
