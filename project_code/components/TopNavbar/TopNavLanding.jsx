import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import styles from "../../styles/TopNavbar.module.css";
import "../../public/logo_P_1.png";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import {
  checkAdmin,
  checkHospital,
  checkPolice,
  checkAmbulance,
  getPageRoute,
} from "../../solidityCalls";
import { providers } from "ethers";
import * as Constants from "../../pages/constants";

export default function TopNavbar() {
  const [metaInstalled, setMetaInstalled] = useState(false);

  const { account, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  const ConnectButton = () => {
    const { account, deactivate, activateBrowserWallet } = useEthers();
    // 'account' being undefined means that we are not connected.
    if (account) {
      return (
        <div>
          <Button onClick={() => deactivate()}>Disconnect</Button>
          <Button onClick={login}>Login</Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button onClick={() => activateBrowserWallet()}>Connect</Button>
        </div>
      );
    }
  };

  // see if matamask is installed and set variable
  const checkMetaInstalled = () => {
    if (typeof window !== "undefined") {
      if (window.ethereum) {
        setMetaInstalled(true);
      } else {
        setMetaInstalled(false);
      }
    }
  };

  const installMeta = () => {
    const forwarderOrigin = "http://localhost:9010";

    // create new metamask onboarding object
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

    // onboard the user for metamask installation
    onboarding.startOnboarding();
    setMetaInstalled(true);
    window.location.reload(false);
  };

  useEffect(() => {
    checkMetaInstalled();
  }, []);

  const connectMeta = () => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {etherBalance && (
          <div className="balance">
            <p className="bold" style={{ margin: "0 20px", color: "#fff" }}>
              Address:{" "}
              {account.substring(0, 5) +
                "..." +
                account.substring(account.length - 4, account.length - 1) +
                "\t"}
              Balance: {formatEther(etherBalance)}
            </p>
          </div>
        )}
        <ConnectButton />
      </div>
    );
  };

  const login = async () => {
    if (!account) {
      console.error("No account available");
      return;
    }

    const provider = new providers.Web3Provider(window.ethereum);

    const isAdmin = await checkAdmin(account, provider);
    const isHospital = await checkHospital(account, provider);
    const isPolice = await checkPolice(account, provider);
    const isAmbulance = await checkAmbulance(account, provider);
    // set session variables
    sessionStorage.setItem("isAdmin", isAdmin);
    sessionStorage.setItem("isHospital", isHospital);
    sessionStorage.setItem("isPolice", isPolice);
    sessionStorage.setItem("isAmbulance", isAmbulance);
    sessionStorage.setItem("accountId", account);
    getPageRoute(isAdmin, isHospital, isPolice, isAmbulance);
  };

  return (
    <div className={styles.topNavbar}>
      <div className={styles.topbarWrapper}>
        <div>
          <span className={styles.topbarLeft}>
            <a href="/">
              <img src="logo_P_1.png" className={styles.topbarLogo}></img>
            </a>
            <h3 className={styles.topbarUser}>{Constants.PROJECT_ABR}</h3>
          </span>
        </div>
        <div className={styles.topbarRight}>
          {metaInstalled ? (
            connectMeta()
          ) : (
            <Button onClick={installMeta} variant="primary">
              Install MetaMask
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
