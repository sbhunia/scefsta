const Accounts = artifacts.require("Accounts");

contract("Accounts", (accounts) => {
  it("should have a superAdmin", async () => {
    const instance = await Accounts.deployed();
    const superAdmin = await instance.superAdmin();
    assert.equal(superAdmin, accounts[0]);
  });

  it("should not allow anyone to add themselves as an admin", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[0], { from: accounts[1] });
    assert.equal(false, await instance.isAdmin(accounts[0]));
  });

  it("should allow the superAdmin to add admins", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    assert.equal(true, await instance.isAdmin(accounts[1]));
  });

  it("should allow the superAdmin to remove admins", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.removeAdmin(accounts[1], { from: accounts[0] });
    assert.equal(false, await instance.isAdmin(accounts[1]));
  });

  it("should allow admins to add ambulances", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.addAmbulance(accounts[2], { from: accounts[1] });
    assert.equal(true, await instance.isAmbulance(accounts[2]));
  });

  it("should allow admins to remove ambulances", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.addAmbulance(accounts[2], { from: accounts[1] });
    await instance.removeAmbulance(accounts[2], { from: accounts[1] });
    assert.equal(false, await instance.isAmbulance(accounts[2]));
  });

  it("should allow admins to add initiators", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.addInitiator(accounts[2], { from: accounts[1] });
    assert.equal(true, await instance.isInitiator(accounts[2]));
  });

  it("should allow admins to remove initiators", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.addInitiator(accounts[2], { from: accounts[1] });
    await instance.removeInitiator(accounts[2], { from: accounts[1] });
    assert.equal(false, await instance.isInitiator(accounts[2]));
  });

  it("should allow admins to add hospitals", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.addHospital(accounts[2], { from: accounts[1] });
    assert.equal(true, await instance.isHospital(accounts[2]));
  });

  it("should allow admins to remove hospitals", async () => {
    const instance = await Accounts.deployed();
    await instance.addAdmin(accounts[1], { from: accounts[0] });
    await instance.addHospital(accounts[2], { from: accounts[1] });
    await instance.removeHospital(accounts[2], { from: accounts[1] });
    assert.equal(false, await instance.isHospital(accounts[2]));
  });
});