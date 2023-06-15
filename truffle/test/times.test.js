const Accounts = artifacts.require("Accounts");
const Auctions = artifacts.require("Auctions");

contract('Accounts', (accounts) => {
    it('gets API latency times of Accounts API functions', async () => {
        const accountsInstance = await Accounts.deployed();
        const fs = require('fs');
        let accountsStr = "addAdmin, addAmbulance, addInitiator, addHospital, isAdmin, isAmbulance, isInitiator, isHosptial, removeAmbulance, removeInitiator, removeHospital, removeAdmin\n";

        for (let i = 1; i < accounts.length - 4; i += 4) {
            // get times for admin functions
            let addAdminStart = Date.now().toString();
            await accountsInstance.addAdmin(accounts[i]);
            let addAdminEnd = Date.now().toString();
            let addAdminTime = (addAdminEnd - addAdminStart).toString();
            accountsStr += addAdminTime + ",";

            let addAmbStart = Date.now().toString();
            await accountsInstance.addAmbulance(accounts[i + 1], {from: accounts[i]});
            let addAmbEnd = Date.now().toString();
            let addAmbTime = (addAmbEnd - addAmbStart).toString();
            accountsStr += addAmbTime + ",";

            let addPolStart = Date.now().toString();
            await accountsInstance.addInitiator(accounts[i + 2], {from: accounts[i]});
            let addPolEnd = Date.now().toString();
            let addPolTime = (addPolEnd - addPolStart).toString();
            accountsStr += addPolTime + ","

            let addHospStart = Date.now().toString();
            await accountsInstance.addHospital(accounts[i + 3], {from: accounts[i]});
            let addHospEnd = Date.now().toString();
            let addHospTime = (addHospEnd - addHospStart).toString();
            accountsStr += addHospTime + ","

            let isAdminStart = Date.now().toString();
            await accountsInstance.isAdmin(accounts[i]);
            let isAdminEnd = Date.now().toString();
            let isAdminTime = (isAdminEnd - isAdminStart).toString();
            accountsStr += isAdminTime + ",";

            let isAmbStart = Date.now().toString();
            await accountsInstance.isAmbulance(accounts[i]);
            let isAmbEnd = Date.now().toString();
            let isAmbTime = (isAmbEnd - isAmbStart).toString();
            accountsStr += isAmbTime + ",";

            let isPolStart = Date.now().toString();
            await accountsInstance.isInitiator(accounts[i]);
            let isPolEnd = Date.now().toString();
            let isPolTime = (isPolEnd - isPolStart).toString();
            accountsStr += isPolTime + ","

            let isHospStart = Date.now().toString();
            await accountsInstance.isHospital(accounts[i]);
            let isHospEnd = Date.now().toString();
            let isHospTime = (isHospEnd - isHospStart).toString();
            accountsStr += isHospTime + ","

            // get remove function times
            let removeAmbStart = Date.now().toString();
            await accountsInstance.removeAmbulance(accounts[i + 1], {from: accounts[i]});
            let removeAmbEnd = Date.now().toString();
            let removeAmbTime = (removeAmbEnd - removeAmbStart).toString();
            accountsStr += removeAmbTime + ",";

            let removePolStart = Date.now().toString();
            await accountsInstance.removeInitiator(accounts[i + 2], {from: accounts[i]});
            let removePolEnd = Date.now().toString();
            let removePolTime = (removePolEnd - removePolStart).toString();
            accountsStr += removePolTime + ","

            let removeHospStart = Date.now().toString();
            await accountsInstance.removeHospital(accounts[i + 3], {from: accounts[i]});
            let removeHospEnd = Date.now().toString();
            let removeHospTime = (removeHospEnd - removeHospStart).toString();
            accountsStr += removeHospTime + ","

            let removeAdminStart = Date.now().toString();
            await accountsInstance.removeAdmin(accounts[i]);
            let removeAdminEnd = Date.now().toString();
            let removeAdminTime = (removeAdminEnd - removeAdminStart).toString();
            accountsStr += removeAdminTime + ",";
            accountsStr += "\n";
        }
        fs.writeFile('times.csv', accountsStr, (err) => {if (err) throw err});
    });
});

contract('Auctions', (accounts) => {
    it('gets API latency times of Auctions API functions', async () => {
        const auctionsInstance = await Auctions.deployed();
    });
});