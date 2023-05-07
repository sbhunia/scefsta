import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { Button } from 'reactstrap';
import styles from '../../styles/TopNavbar.module.css';
import '../../public/logo_P_1.png';
import MetaMaskOnboarding from '@metamask/onboarding';
import { OnboardingButton } from '../Onboarding';
import { render } from 'react-dom';

import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, Goerli } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { getDefaultProvider } from 'ethers'

export default function TopNavbar() {
    // const [buttonText, setButtonText] = useState("Connect");
    // const [buttonDisabled, setButtonDisabled] = useState(false);
    // const [connected, setConnected] = useState(false);
    // const { activateBrowserWallet, account } = useEthers();
    // const balance = useEtherBalance(account);
    const [metaInstalled, setMetaInstalled] = useState(false);


    const { account, chainId } = useEthers()
    const etherBalance = useEtherBalance(account)
    // if (chainId && !config.readOnlyUrls[chainId]) {
    //     return <p>Please use either Mainnet or Goerli testnet.</p>
    // }

    const ConnectButton = () => {
        const { account, deactivate, activateBrowserWallet } = useEthers()
        // 'account' being undefined means that we are not connected.
        if (account) {
            return (
                <div>
                    <Button onClick={() => deactivate()}>Disconnect</Button>
                    <Button onClick={login}>Login</Button> 
                </div>
            )
        }
        else {
            return (
                <div>
                    <Button onClick={() => activateBrowserWallet()}>Connect</Button>
                </div>
            )
        }
    }

    // see if matamask is installed and set variable
    const checkMetaInstalled = () => {
        if (typeof window !== 'undefined') {
            if (window.ethereum) {
                setMetaInstalled(true);
            } else {
                setMetaInstalled(false);
            }
        }
    }

    const installMeta = () => {
        const forwarderOrigin = 'http://localhost:9010';

        // create new metamask onboarding object
        const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

        // onboard the user for metamask installation
        onboarding.startOnboarding();
        setMetaInstalled(true);
        window.location.reload(false);
    }

    useEffect(() => {
        checkMetaInstalled();
    })

    const connectMeta = () => {
        return (
            <div style={{display:'flex',alignItems:'center'}}>
                {/* {isActive ? <span>Connected with {ABR_ADD}</span> : <span>MetaMask Not Connected</span>}
                {isActive ? <Button onClick={disconnect} variant="primary">Disconnect Metamask</Button> : <Button onClick={connect} variant="danger">Connect Metamask</Button>}
                {isActive ? <Button onClick={login}>Login</Button> :
                    <Button disabled>Login</Button>} */}

                {etherBalance && (
                    <div className="balance" >
                        <p className="bold"  style={{margin:'0 20px',color:'#fff'}}>Address: {account.substring(0, 5) + "..." + account.substring(account.length - 4, account.length - 1) + "\t"}
                            Balance: {formatEther(etherBalance)}</p>
                    </div>
                )}
                <ConnectButton />
            </div>
        );
    }

    const login = () => {
        Router.push('/home');
    }

    return (
        /* In progress */
        <div className={styles.topNavbar}>
            <div className={styles.topbarWrapper}>
                <div>
                    <span className={styles.topbarLeft}>
                        <a href='/'><img src='logo_P_1.png' className={styles.topbarLogo}></img></a>
                        <h3 className={styles.topbarUser}>AIS</h3>
                    </span>
                </div>
                <div className={styles.topbarRight}>
                    {metaInstalled ? connectMeta() : <Button onClick={installMeta} variant="primary">Install MetaMask</Button>}

                </div>
            </div>
        </div>
        /* Final code */
        // <div className={styles.topNavbar}>
        //     <div className={styles.topbarWrapper}>
        //         <div>
        //             <span className={styles.topbarLeft}>
        //                 <a href='/'><img src='logo_P_1.png' className={styles.topbarLogo}></img></a>
        //                 <h3 className={styles.topbarUser}>AIS</h3>
        //             </span>
        //         </div>
        //         <div className={styles.topbarRight}>
        //             {metaInstalled ? connectMeta() : <Button onClick={installMeta} variant="primary">Install MetaMask</Button>}
        //         </div>
        //     </div>
        // </div>
    )
}