import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Sidebar from "../components/SideBar/Sidebar";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import styles from "../styles/Profile.module.css";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import withMetaMask from "../components/WithMetaMask";

function Profile() {
  const { account, chainId } = useEthers();
  const [data, setData] = useState([]);
  const balance = useEtherBalance(account);

  if (balance != undefined) {
    console.log(formatEther(balance));
  }

  useEffect(() => {
    fetch("/api/hospitals")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      window.location.href = "/login"; // Redirect to login page after logout
    } catch (error) {
      console.log(error);
    }
  };

  if (account && chainId && balance != undefined) {
    const my =
      data.find((el) => {
        console.log(el.walletId == account, el.walletId, account);
        return el.walletId == account;
      }) || {};
    console.log(my);
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.totalContainer}>
            <div className={styles.pageTitle}>
              <h2>Profile</h2>
            </div>
            <div className={styles.profile}>
              <h2 style={{ textAlign: "center" }}>Account Information</h2>
              <div className={styles.row}>
                <div className={styles.column}>
                  <h3>WalletId</h3>
                  <div className={styles.account}>{account}</div>
                  <div className={styles.account}>{formatEther(balance)}</div>
                  {/* <h3>First Name</h3>
                                    <div className={styles.account}>
                                        {my.firstName||'-'}
                                    </div>
                                    <h3>Last Name</h3>
                                    <div className={styles.account}>
                                        {my.lastName||'-'}
                                    </div>
                                    <h3>Email</h3>
                                    <div className={styles.account}>
                                        {my.email||'-'}
                                    </div>
                                </div>
                                <div className={styles.column}>
                                    <h3>IP</h3>
                                    <div className={styles.account}>
                                        {my.ipAddress||'-'}
                                    </div>
                                    <h3>User Name</h3>
                                    <div className={styles.account}>
                                        {my.username||'-'}
                                    </div>
                                    <h3>Address</h3>
                                    <div className={styles.account}>
                                        {my.address||'-'}
                                    </div>
                                    <h3>City</h3>
                                    <div className={styles.account}>
                                        {my.city||'-'}
                                    </div> */}
                </div>
              </div>
              <div className={styles.logout}>
                <div className={styles["logout-btn"]}>
                  <Button
                    style={{ display: "block", margin: "0 auto" }}
                    onClick={() => {
                      window.localStorage.removeItem("transactions");
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
              {/* <div className={styles.balance}>
                            {balance && <p>Balance: {formatEther(balance)}</p>}
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.entire}>
        <TopNavbar />
        <div className={styles.collector}>
          <Sidebar />
          <div className={styles.totalContainer}>
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withMetaMask(Profile);
