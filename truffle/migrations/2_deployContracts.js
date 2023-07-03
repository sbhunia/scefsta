const Accounts = artifacts.require("Accounts");
const Auctions = artifacts.require("Auctions");

module.exports = async function (deployer) {
    await deployer.deploy(Accounts);
    const accountsContract = await Accounts.deployed();
  
    await deployer.deploy(Auctions, accountsContract.address);
    const auctionsContract = await Auctions.deployed();
  
    console.log("export const accountsAddress = '" + accountsContract.address + "';\n  \
                 export const auctionsAddress = '" + auctionsContract.address + "';");
  };