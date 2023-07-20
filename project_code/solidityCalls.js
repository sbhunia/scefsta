import { useCall } from "@usedapp/core";
import { accountsAddress, auctionsAddress } from "./config";
import { ACCOUNT_INSTANCE, AUCTION_INSTANCE } from "./pages/_app";
import Router from "next/router";

/**
 * Checks if a user is a verified contract administrator
 * @param {*} account Wallet ID
 * @returns
 */
export const checkAdmin = async (account, provider) => {
  try {
    // Create a signer using the provider
    const signer = provider.getSigner();

    // Connect the contract instance to the signer
    const connectedAccountInstance = ACCOUNT_INSTANCE.connect(signer);

    // Call the desired function on the contract instance
    const result = await connectedAccountInstance.isAdmin(account);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Checks if a user is a verified hospital
 * @param {*} account Wallet ID
 * @returns
 */
export const checkHospital = async (account, provider) => {
  try {
    // Create a signer using the provider
    const signer = provider.getSigner();

    // Connect the contract instance to the signer
    const connectedAccountInstance = ACCOUNT_INSTANCE.connect(signer);

    // Call the desired function on the contract instance
    const result = await connectedAccountInstance.isHospital(account);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Checks if user is a verified police entity.
 * @param {*} account Wallet ID
 */
export const checkPolice = async (account, provider) => {
  try {
    // Create a signer using the provider
    const signer = provider.getSigner();

    // Connect the contract instance to the signer
    const connectedAccountInstance = ACCOUNT_INSTANCE.connect(signer);

    // Call the desired function on the contract instance
    const result = await connectedAccountInstance.isInitiator(account);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Checks if user is a verified EMS entity.
 * @param {*} account Wallet ID
 * @returns
 */
export const checkAmbulance = async (account, provider) => {
  try {
    // Create a signer using the provider
    const signer = provider.getSigner();

    // Connect the contract instance to the signer
    const connectedAccountInstance = ACCOUNT_INSTANCE.connect(signer);

    // Call the desired function on the contract instance
    const result = await connectedAccountInstance.isAmbulance(account);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Get all tenders and tender information
 * @returns array of tenders
 */
export const getAllTenders = () => {
  const { value, error } =
    useCall(
      auctionsAddress && {
        contract: AUCTION_INSTANCE,
        method: "getAllTenders",
        args: [],
      }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value;
};

/**
 *
 * @param {*} tenderId
 * @returns
 */
export const getTender = (tenderId) => {
  const { value, error } =
    useCall(
      auctionsAddress && {
        contract: AUCTION_INSTANCE,
        method: "getTender",
        args: [tenderId],
      }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value;
};

export const getAuctionWinner = async (tenderId, provider) => {
  try {
    // Create a signer using the provider
    const signer = provider.getSigner();

    // Connect the contract instance to the signer
    const connectedAuctionInstance = AUCTION_INSTANCE.connect(signer);

    // Call the desired function on the contract instance
    const result = await connectedAuctionInstance.getAuctionWinner(tenderId);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getPageRoute = (isAdmin, isHospital, isPolice, isAmbulance) => {
  // Use the results of the check functions for further logic
  if (isAdmin) {
    Router.push("/admin");
  } else if (isHospital) {
    Router.push("/hospital");
  } else if (isPolice) {
    Router.push("/police");
  } else if (isAmbulance) {
    Router.push("/ambulance");
  } else {
    alert("Wallet is not associated with a valid account, contact an admin");
  }
};
