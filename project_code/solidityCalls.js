import { useCall } from '@usedapp/core';
import { accountsAddress, auctionsAddress } from './config';
import { ACCOUNT_INSTANCE, AUCTION_INSTANCE } from './pages/_app';

/**
 * Checks if a user is a verified contract administrator
 * @param {*} account Wallet ID 
 * @returns 
 */
export const checkAdmin = (account) => {
    const { value, error } = useCall(accountsAddress && {
        contract: ACCOUNT_INSTANCE,
        method: 'isAdmin',
        args: [account],
    }) ?? {};

    if (error) {
        console.error(error.message);
        return undefined;
    }
    return value?.[0];
}

/**
 * Checks if a user is a verified hospital
 * @param {*} account Wallet ID 
 * @returns 
 */
export const checkHospital = (account) => {
    const { value, error } = useCall(accountsAddress && {
        contract: ACCOUNT_INSTANCE,
        method: 'isHospital',
        args: [account],
    }) ?? {};

    if (error) {
        console.error(error.message);
        return undefined;
    }
    return value?.[0];
}

/**
 * Checks if user is a verified police entity.
 * @param {*} account Wallet ID
 */
export const checkPolice = (account) => {
    const { value, error } = useCall(accountsAddress && {
        contract: ACCOUNT_INSTANCE,
        method: 'isInitiator',
        args: [account],
    }) ?? {};

    if (error) {
        console.error(error.message);
        return undefined;
    }
    return value?.[0];
}

/**
 * Checks if user is a verified EMS entity.
 * @param {*} account Wallet ID
 * @returns
 */
export const checkAmbulance = (account) => {
    const { value, error } = useCall(accountsAddress && { 
        contract: ACCOUNT_INSTANCE,
        method: 'isAmbulance',
        args: [account],
        }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    }
    return value?.[0];
}

/**
 * Get all tenders and tender information
 * @returns array of tenders
 */
export const getAllTenders = () => {
    const { value, error } = useCall(auctionsAddress && { 
        contract: AUCTION_INSTANCE,
        method: 'getAllTenders',
        args: [],
        }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    } 
    return value;
}

/**
 * 
 * @param {*} tenderId 
 * @returns 
 */
export const getTender = (tenderId) => {
    const { value, error } = useCall(auctionsAddress && { 
        contract: AUCTION_INSTANCE,
        method: 'getTender',
        args: [tenderId],
        }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    } 
    return value;
}

export const getWinner = (tenderId) => {
    const { value, error } = useCall(auctionsAddress && {
        contract: AUCTION_INSTANCE,
        method: 'getWinner',
        args: [tenderId],
    }) ?? {};

    if(error) {
        console.error(error.message);
        return undefined;
    } 
    return value;
}





