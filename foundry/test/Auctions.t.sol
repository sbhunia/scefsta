pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

import "../src/Auctions.sol";
import "../src/Accounts.sol";

// SPDX-License-Identifier: UNLICENSED

contract AuctionsTest is Test {
    Accounts public acc;
    Auctions public auc;
    address superAdmin;

    // accounts to be used
    address admin;
    address ambulance;
    address initiator;
    address hospital;
    address[] allowedHospitals;
    
    // tender post variables
    uint256 tender;
    uint256 timeLimit;
    uint256 deliveryTime;
    uint256 penalty;

    // bid variables
    uint256 bidVal;
    uint256 saltVal;
    uint256 hashVal;

    // results
    bool res;

    function setUp() public {
        // set this address as the admin address and create instance of the AmbulanceBounties contract
        superAdmin = vm.addr(1);
        vm.startPrank(superAdmin);
        acc = new Accounts();
        auc = new Auctions(address(acc));
        vm.stopPrank();

        // addresses to be used for testing
        admin = vm.addr(2);
        ambulance = vm.addr(3);
        initiator = vm.addr(4);
        hospital = vm.addr(5);

        // set variables
        timeLimit = 1000;
        deliveryTime = 10000;
        penalty = 20;

        // set bid variables
        bidVal = 100;
        saltVal = 10;

        // add new admin
        vm.startPrank(superAdmin);
            acc.addAdmin(admin);
        vm.stopPrank();

        // add the three main accounts
        vm.startPrank(admin);
            acc.addAmbulance(ambulance);
            acc.addInitiator(initiator);
            acc.addHospital(hospital);
            allowedHospitals.push(hospital);
        vm.stopPrank();
    }

    function testPostTender() public {
        // validate accounts is working
        bool init = acc.isInitiator(initiator);
        assertEq(true, init);

        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 100}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 0);

        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 100}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 1);
    }

    function cannotPostTender() public {}

    function testSecretBid() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 100}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 0);

        uint hashVal = auc.hashVal(bidVal, saltVal);
        hoax(ambulance, 10000 ether);
        auc.secretBid{value: penalty}(tender, hashVal);
    }

    function testRevealBid() public {

    }

    function testVerifyDelivery() public {

    }

    function testReclaimTender() public {

    }

    function testRetractTender() public {

    }

    function testGetAllTenders() public {

    }

    function testGetWinner() public {

    }
}