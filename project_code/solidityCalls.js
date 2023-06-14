import { useCall, useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { accountsAddress, accounts_abi, auctionsAddress, auctions_abi } from './config';
import { utils } from 'ethers';


// accounts info
const accountsAbiInterface = new utils.Interface(accounts_abi);
const accountsContractInstance = new Contract(accountsAddress, accountsAbiInterface);

// auctions info
const auctionsAbiInterface = new utils.Interface(auctions_abi);
const auctionsContractInstance = new Contract(auctionsAbiInterface, auctions_abi);
/**
 * Checks if a user is a verified contract administrator
 * @param {*} account Wallet ID 
 * @returns 
 */
export const checkAdmin = (account) => {
    const { value, error } = useCall(accountsAddress && {
        contract: accountsContractInstance,
        method: 'isAdmin',
        args: [account],
    }) ?? {};

    if (error) {
        console.error(error.message);
        return undefined;
    }
    //console.log("value: ", value?.[0]);
    return value?.[0];
}

/**
 * Checks if a user is a verified hospital
 * @param {*} account Wallet ID 
 * @returns 
 */
export const checkHospital = (account) => {
    const { value, error } = useCall(accountsAddress && {
        contract: accountsContractInstance,
        method: 'isHospital',
        args: [account],
    }) ?? {};

    if (error) {
        console.error(error.message);
        return undefined;
    }
    //console.log("value: ", value?.[0]);
    return value?.[0];
}

/**
 * Checks if user is a verified police entity.
 * @param {*} account Wallet ID
 */
export const checkPolice = (account) => {
    const { value, error } = useCall(accountsAddress && {
        contract: accountsContractInstance,
        method: 'isPolice',
        args: [account],
    }) ?? {};

    if (error) {
        console.error(error.message);
        return undefined;
    }
    //console.log("value: ", value?.[0]);
    return value?.[0];
}

/**
 * Checks if user is a verified EMS entity.
 * @param {*} account Wallet ID
 * @returns
 */
export const checkAmbulance = (account) => {
    const { value, error } = useCall(accountsAddress && { 
        contract: accountsContractInstance,
        method: 'isAmbulance',
        args: [account],
        }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    }
    //console.log("value: ", value?.[0]);
    return value?.[0];
}

/**
 * Get all tenders and tender information
 * @returns array of tenders
 */
export const getAllTenders = () => {
    const { value, error } = useCall(auctionsAddress && { 
        contract: auctionsContractInstance,
        method: 'getAllTenders',
        args: [],
        }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    } 
    return value;
}

export const getWinner = (tenderId) => {
    const { value, error } = useCall(auctionsAddress && {
        contract: auctionsContractInstance,
        method: 'getWinner',
        args: [tenderId],
    }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    } 
    return value;
}

// export const hashVal = (bid, salt) => {
    

//     return value;
// }




