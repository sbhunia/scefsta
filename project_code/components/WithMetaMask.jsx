import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Router from "next/router";

const withMetaMask = (WrappedComponent) => {
  const WithMetaMask = (props) => {
    const [connectedAccount, setConnectedAccount] = useState("");

    useEffect(() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const checkAccount = async () => {
        const accounts = await provider.listAccounts();

        if (accounts.length === 0) {
          // Redirect to login page if MetaMask is not connected
          alert("You must re-login to change accounts");
          Router.push("/"); // Replace '/login' with the actual login page route
        } else {
          const currentAccount = accounts[0];

          if (connectedAccount && currentAccount !== connectedAccount) {
            // Redirect to login page if the MetaMask account is switched
            alert("You must re-login to change accounts");
            Router.push("/"); // Replace '/login' with the actual login page route
          } else {
            setConnectedAccount(currentAccount);
          }
        }
      };

      checkAccount();

      window.ethereum.on("accountsChanged", checkAccount);

      return () => {
        window.ethereum.removeListener("accountsChanged", checkAccount);
      };
    }, [connectedAccount]);

    return <WrappedComponent {...props} />;
  };

  return WithMetaMask;
};

export default withMetaMask;
