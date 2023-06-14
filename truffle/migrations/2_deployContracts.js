const Accounts = artifacts.require("Accounts");
const Auctions = artifacts.require("Auctions");

module.exports = function (deployer) {
    deployer.deploy(Accounts);
}