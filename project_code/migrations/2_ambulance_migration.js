const ambulanceBounties = artifacts.require('./AmbulanceBounties');

module.exports = function(deployer) {
    deployer.deploy(ambulanceBounties, {gas: 8000000});
}