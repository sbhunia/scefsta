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

    // struct info for tenders
    // enum for various possible tender status's, closed is default
    enum TenderStatus {
        Closed,
        InProgress,
        Open,
        Retracted,
        Reclaimed
    }

    // helper struct for tender details
     struct TenderDetails {
        address payable tenderPoster;
        address payable tenderAccepter;
        uint256 postDate;
        uint256 auctionDate;
        uint256 revealDate;
        uint256 dueDate;
        string addr;
        string city;
        string state;
        address[] allowedHospitals;
        uint256 maxBid;
        uint256 penalty;
        // Maps an address to its bid. This enforces one bid per address, 
        //so that ambulances do not just bid as many prices as they can, 
        //and then reveal lower and lower bids during the reveal period.
        // We use 2 arrays because we can't have nested mappings in Solidity.
        address[] bidders;
        uint[] bidHashArray;
        uint256 finalBid;
        string severity;
    }

    // struct to hold tender information
    struct Tender {
        TenderDetails details;
        TenderStatus status;
        uint256 tenderId;
    }

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

        // extra accounts
        ambulance2 = vm.addr(6);

        // set variables
        timeLimit = 30;
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

            acc.addAmbulance(ambulance2);
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
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", 0, "High", allowedHospitals);
        assertEq(tender, 0);

        hashVal = auc.hashVal(bidVal, saltVal);
        hoax(ambulance, 10000 ether);
        uint bidID1 = auc.secretBid{value: 0}(tender, hashVal);
        assertEq(0, bidID1);

        hoax(ambulance2, 10000 ether);
        uint bidID2 = auc.secretBid{value: 0}(tender, hashVal);
        assertEq(1, bidID2);
    }

    function testRevealBid() public {  
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hashVal = auc.hashVal(bidVal, saltVal);
        hoax(ambulance, 10000 ether);
        uint bidID = auc.secretBid{value: penalty}(tender, hashVal);
        assertEq(0, bidID);

        hoax(ambulance, 1000 ether);
        auc.revealBid{value: penalty}(tender, bidVal, saltVal, bidID);
    }

    function testVerifyDelivery() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hashVal = auc.hashVal(bidVal, saltVal);
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
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hashVal = auc.hashVal(bidVal, saltVal);
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
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        assertEq(tender, 0);
        
        hoax(initiator, 1000 ether);
        auc.retractTender(tender);
    }

    function testGetAllTenders() public {
        Auctions.Tender[] memory tenders = auc.getAllTenders();
        assertEq(tenders.length, 0);

        hoax(initiator, 10000 ether);
        auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        tenders = auc.getAllTenders();
        assertEq(tenders.length, 1);
        
        hoax(initiator, 10000 ether);
        auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", penalty, "High", allowedHospitals);
        tenders = auc.getAllTenders();
        assertEq(tenders.length, 2);
    }

    function testGetAuctionWinner() public {
        hoax(initiator, 10000 ether);
        tender = auc.postTender{value: 10000}(timeLimit, deliveryTime, "311 Thatcher Loop", "Oxford", "Ohio", 0, "High", allowedHospitals);
        assertEq(tender, 0);

        hashVal = auc.hashVal(bidVal, saltVal);
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
