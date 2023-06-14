const Accounts = artifacts.require("Accounts");
const Auctions = artifacts.require("Auctions");

module.exports = function (deployer) {
    deployer.deploy(Accounts);
    deployer.deploy(Auctions, Accounts.address);

    console.log("Accounts contract address:", Accounts.address);
    console.log("Auctions contract address:", Auctions.address);
}