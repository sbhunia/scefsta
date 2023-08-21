import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Sidebar from "../components/SideBar/Sidebar";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import styles from "../styles/Profile.module.css";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import withMetaMask from "../components/WithMetaMask";
import * as Constants from "../constants";

function Profile() {
  const [account, setAccount] = useState();
  const [users, setUsers] = useState();
  const { chainId } = useEthers();
  const balance = useEtherBalance(account);

  useEffect(() => {
    const getUsers = async (walletId) => {
      const res = await fetch(Constants.getUsers + "?walletId=" + walletId);
      const data = await res.json();
      setUsers(data);
    };

    let walletId = sessionStorage.getItem("accountId");
    setAccount(walletId);

    if (!users) {
      getUsers(walletId);
    }
  }, []);


  const UserData = ({user}) => {
    const userFields = [
      { label: "First Name", value: user.firstName },
      { label: "Last Name", value: user.lastName },
      { label: "Email", value: user.email },
      { label: "Address", value: user.address },
      { label: "City", value: user.city },
      { label: "State", value: user.state },
      { label: "Zip Code", value: user.zipcode },
      { label: "Police Department", value: user.policeDept },
      { label: "Station Number", value: user.stationNumber },
      { label: "Transport Company", value: user.transportCompany },
      { label: "License Plate", value: user.licensePlate },
      { label: "Facility Name", value: user.facilityName },
      { label: "Initiator Type", value: user.initiatorType },
      { label: "Account Type", value: user.accountType },
    ];

    return (
      <div>
        <ul>
          {userFields.map((field) => {
            if (field.value !== null) {
              return (
                <li key={field.label}>
                  <strong>{field.label}:</strong> {field.value}
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }

  if (account && chainId && balance != undefined && users != undefined) {
    const my =
      users.find((el) => {
        return el.walletId == account;
      }) || {};
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
              <UserData user={users[0]}/>

              <div className={styles.logout}>
                <div className={styles["logout-btn"]}>
                  <Button color="warning"
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
