const Accounts = artifacts.require("Accounts");

contract("Accounts", (accounts) => {
  it("tests isAddRemoveAdmin", async () => {
    const adminInstance = await Accounts.new();
    let isAdmin;

    isAdmin = await adminInstance.isAdmin(accounts[1]);
    assert.equal(isAdmin, false);

    await adminInstance.addAdmin(accounts[1]);
    isAdmin = await adminInstance.isAdmin(accounts[1]);
    assert.equal(isAdmin, true);

    await adminInstance.removeAdmin(accounts[1]);
    isAdmin = await adminInstance.isAdmin(accounts[1]);
    assert.equal(isAdmin, false);
  });

  it("tests isAddRemoveInitiator", async () => {
    const initiatorInstance = await Accounts.new();
    await initiatorInstance.addAdmin(accounts[1]);
    let isInitiator;

    isInitiator = await initiatorInstance.isInitiator(accounts[2]);
    assert.equal(isInitiator, false);

    await initiatorInstance.addInitiator(accounts[2], {from: accounts[1]});
    isInitiator = await initiatorInstance.isInitiator(accounts[2]);
    assert.equal(isInitiator, true);

    await initiatorInstance.removeInitiator(accounts[2], {from: accounts[1]});
    isInitiator = await initiatorInstance.isInitiator(accounts[2]);
    assert.equal(isInitiator, false);
  });

  it("tests isAddRemoveAmbulance", async () => {
    const ambulanceInstance = await Accounts.new();
    await ambulanceInstance.addAdmin(accounts[1]);
    let isAmbulance;

    isAmbulance = await ambulanceInstance.isAmbulance(accounts[2]);
    assert.equal(isAmbulance, false);

    await ambulanceInstance.addAmbulance(accounts[2], {from: accounts[1]});
    isAmbulance = await ambulanceInstance.isAmbulance(accounts[2]);
    assert.equal(isAmbulance, true);

    await ambulanceInstance.removeAmbulance(accounts[2], {from: accounts[1]});
    isAmbulance = await ambulanceInstance.isAmbulance(accounts[2]);
    assert.equal(isAmbulance, false);
  });

  it("tests isAddRemoveHospital", async () => {
    const hospitalInstance = await Accounts.new();
    await hospitalInstance.addAdmin(accounts[1]);
    let isHospital;

    isHospital = await hospitalInstance.isHospital(accounts[2]);
    assert.equal(isHospital, false);

    await hospitalInstance.addHospital(accounts[2], {from: accounts[1]});
    isHospital = await hospitalInstance.isHospital(accounts[2]);
    assert.equal(isHospital, true);

    await hospitalInstance.removeHospital(accounts[2], {from: accounts[1]});
    isHospital = await hospitalInstance.isHospital(accounts[2]);
    assert.equal(isHospital, false);
  });
});