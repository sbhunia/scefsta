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
    address ambulance2;
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
        // set this address as the admin address and create instance of the Auctions contract
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

        // extra accounts
        ambulance2 = vm.addr(6);

        // set variables
        timeLimit = 30;
        deliveryTime = 10000;
        penalty = 20;

        // set bid variables
        bidVal = 100;
        saltVal = 10;
        hashVal = uint(keccak256(abi.encodePacked(bidVal + saltVal)));

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

            acc.addAmbulance(ambulance2);
        vm.stopPrank();
    }

    function testPostTender() public {
        // validate accounts is working
        bool init = acc.isInitiator(initiator);
        assertEq(true, init);

        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 100}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        assertEq(tender, 0);

        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 100}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        assertEq(tender, 1);
    }

    function cannotPostTender() public {}

    function testSecretBid() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", 0, "High", allowedHospitals);
        assertEq(tender, 0);

        hashVal = 110;
        hoax(ambulance, 10000 ether);
        uint bidID1 = auc.secretBid{value: 0}(tender, hashVal);
        assertEq(0, bidID1);

        hoax(ambulance2, 10000 ether);
        uint bidID2 = auc.secretBid{value: 0}(tender, hashVal);
        assertEq(1, bidID2);
    }

   function testRevealBid() public {  
        hoax(initiator, 10000 ether);
        uint256 tenderId = auc.postTender{value: 10000}(
            timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals
        );
        assertEq(tenderId, 0);
        
        hoax(ambulance, 10000 ether);
        uint256 bidID = auc.secretBid{value: penalty}(tenderId, hashVal);
        assertEq(0, bidID);

        skip(timeLimit + 5);
        hoax(ambulance, 1000 ether);
        auc.revealBid{value: penalty}(tenderId, bidVal, saltVal, bidID);

        Auctions.Tender memory newTender = auc.getTender(tenderId);
        assertTrue(newTender.status == Auctions.TenderStatus.InProgress);
        assertTrue(newTender.details.finalBid == bidVal);
        assertTrue(newTender.details.tenderAccepter == ambulance);
    }
 
    function testVerifyDelivery() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hashVal = 110;
        hoax(ambulance, 10000 ether);
        uint bidID = auc.secretBid{value: penalty}(tender, hashVal);
        assertEq(0, bidID);

        hoax(ambulance, 1000 ether);
        auc.revealBid{value: penalty}(tender, bidVal, saltVal, bidID);

        hoax(hospital, 1000 ether);
        auc.verifyDelivery(tender);
    }

    function testReclaimTender() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hashVal = 110;
        hoax(ambulance, 10000 ether);
        uint bidID = auc.secretBid{value: penalty}(tender, hashVal);
        assertEq(0, bidID);

        hoax(ambulance, 1000 ether);
        auc.revealBid{value: penalty}(tender, bidVal, saltVal, bidID);

        hoax(initiator, 1000 ether);
        auc.reclaimTender(tender);
    }

    function testRetractTender() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hoax(initiator, 1000 ether);
        auc.retractTender(tender);
    }

    function testGetAllTenders() public {
        Auctions.Tender[] memory tenders = auc.getAllTenders();
        assertEq(tenders.length, 0);

        hoax(initiator, 10000 ether);
        auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        tenders = auc.getAllTenders();
        assertEq(tenders.length, 1);
        
        hoax(initiator, 10000 ether);
        auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        tenders = auc.getAllTenders();
        assertEq(tenders.length, 2);
    }

    function testGetTender() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", penalty, "High", allowedHospitals);
        Auctions.Tender memory retTender = auc.getTender(tender);
        assertEq(retTender.tenderId, tender);
    }

    function testGetAuctionWinner() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", "45056", 0, "High", allowedHospitals);
        assertEq(tender, 0);

        hashVal = 110;
        hoax(ambulance, 10000 ether);
        uint bidID1 = auc.secretBid{value: 0}(tender, hashVal);
        assertEq(0, bidID1);

        hoax(ambulance2, 10000 ether);
        uint bidID2 = auc.secretBid{value: 0}(tender, hashVal);
        assertEq(1, bidID2);

        hoax(ambulance, 10000 ether);
        auc.revealBid(tender, bidVal, saltVal, bidID1);

        address winner = auc.getAuctionWinner(tender);
        assertEq(winner, ambulance);
    }
}
