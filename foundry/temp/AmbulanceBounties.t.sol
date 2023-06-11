pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

import "../temp/AmbulanceBounties.sol";

// SPDX-License-Identifier: UNLICENSED

contract AmbulanceBountiesTest is Test {
    AmbulanceBounties public ab;
    uint256 testId;
    int256 tenderId;
    uint256 index;
    address ambulance;
    address police;
    address hospital;
    uint256 timeLimit;
    uint256 penalty;
    address admin;

    string location;
    address[] allowedHospitals;
    address[] fakeHospitals;

    bytes32 tenderIdedAmount;
    uint256 bidValue;
    uint256 saltVal;

    enum TenderStatus {
        Closed,
        InProgress,
        Open
    }

    function setUp() public {
        // set this address as the admin address and create instance of the AmbulanceBounties contract
        admin = 0xAd6cacC05493c496b53CCa73AB0ADf0003cB2D80;
        vm.startPrank(admin);
        ab = new AmbulanceBounties();
        vm.stopPrank();

        // creat variables to be used for testing
        testId = 1;
        timeLimit = 30;
        penalty = 1000;

        // addresses to be used for testing
        ambulance = 0x37b17D21569C2cA6c7A078f2283D06BC222F554C;
        police = 0xcdF98E3f41A0160360884f67BF8FfF35D92d4E2f;
        hospital = 0xad6cAcC05493c496B53CCa73Ab0adf0003CB2d83;

        location = "501 E. High street";

        tenderId = 1;
        tenderIdedAmount = 0x7465737400000000000000000000000000000000000000000000000000000000;
        index = 0;
        bidValue = 100;
        saltVal = 10;
    }

    // function testGasTimes() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addHospital(hospital);
    //     allowedHospitals.push(hospital);
    //     ab.addAmbulance(ambulance);
    //     vm.stopPrank();

    //     for (uint256 i = 0; i < 1; i++) {
    //         address adr;
    //         //bytes32 hash = keccak256(abi.encode(block.timestamp, i));
    //         uint hash = bidValue + saltVal;
    //         assembly {
    //             mstore(0x0, hash)
    //             adr := mload(0x0)
    //             {

    //             }
    //         }

    //         vm.startPrank(admin);
    //         if (i != 0) {
    //             ab.addAmbulance(adr);
    //             ab.addPolice(adr);
    //             ab.addHospital(adr);
    //         }
    //         ab.isAmbulance(ambulance);
    //         ab.isHospital(hospital);
    //         ab.isPolice(police);
    //         ab.isAdmin(admin);
    //         vm.stopPrank();

    //         // generate random int later
    //         uint256 saltVal = 10;
    //         //bytes32 hash2 = keccak256(abi.encodePacked(bidValue + saltVal));
    //         uint hash2 = bidValue + saltVal;
    //         //emit log_bytes32(hash2);
    //         hoax(police, 10000000000000000 ether);
    //         int256 tender = ab.postTender{value: 1000000000000000000}(
    //             timeLimit,
    //             location,
    //             allowedHospitals,
    //             penalty
    //         );
    //         hoax(ambulance, 1000 ether);
    //         ab.secretBid{value: penalty}(tender, hash2);

    //         hoax(ambulance, 1000 ether);
    //         ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);
    //         ab.getWinner(tender);

    //         vm.startPrank(hospital);
    //         ab.verifyDelivery(tender);
    //         vm.stopPrank();

    //         vm.startPrank(police);
    //         //ab.reclaimTender(tender);

    //         // comment out revealBid if calling retract tender
    //         //ab.retractTender(tender);
    //         vm.stopPrank();
    //     }
    //     // vm.startPrank(admin);
    //     // ab.isAmbulance(ambulance);
    //     // ab.isHospital(hospital);
    //     // ab.isPolice(police);
    //     // ab.isAdmin(admin);
    //     // vm.stopPrank();
    // }

    function testAddIsRemoveAmbulance() public {
        vm.startPrank(admin);
        bool res = ab.isAmbulance(ambulance);
        assertEq(res, false);

        ab.addAmbulance(ambulance);
        res = ab.isAmbulance(ambulance);
        assertEq(res, true);

        ab.removeAmbulance(ambulance);
        res = ab.isAmbulance(ambulance);
        assertEq(res, false);

        res = ab.isAmbulance(police);
        assertEq(res, false);
        vm.stopPrank();
    }

    function testAddIsRemovePolice() public {
        vm.startPrank(admin);
        bool res = ab.isPolice(police);
        assertEq(res, false);

        ab.addPolice(police);
        res = ab.isPolice(police);
        assertEq(res, true);

        ab.removePolice(police);
        res = ab.isPolice(police);
        assertEq(res, false);

        res = ab.isPolice(ambulance);
        assertEq(res, false);
        vm.stopPrank();
    }

    function testAddIsRemoveHospital() public {
        vm.startPrank(admin);
        bool res = ab.isHospital(hospital);
        assertEq(res, false);

        ab.addHospital(hospital);
        res = ab.isHospital(hospital);
        assertEq(res, true);

        ab.removeHospital(hospital);
        res = ab.isHospital(hospital);
        assertEq(res, false);

        res = ab.isHospital(ambulance);
        assertEq(res, false);
        vm.stopPrank();
    }

    function testIsAdmin() public {
        bool res = ab.isAdmin(admin);
        assertEq(res, true);

        res = ab.isAdmin(police);
        assertEq(res, false);
    }

    function testPostTender() public {
        vm.startPrank(admin);
        ab.addPolice(police);
        ab.addHospital(hospital);
        allowedHospitals.push(hospital);
        vm.stopPrank();

        hoax(police, 100 ether);
        int256 tender = ab.postTender{value: 100}(
            timeLimit,
            location,
            allowedHospitals,
            penalty,
            "critical"
        );
        assertEq(tender, 0);

        hoax(police, 100 ether);
        tender = ab.postTender{value: 100}(
            timeLimit,
            location,
            allowedHospitals,
            penalty,
            "critical"
        );
        assertEq(tender, 1);
    }

    function testCannotPostTender() public {
        vm.startPrank(admin);
        ab.addPolice(police);
        ab.addHospital(hospital);
        allowedHospitals.push(hospital);
        vm.stopPrank();

        hoax(police, 0 ether);
        vm.expectRevert();
        ab.postTender{value: 10000}(
            timeLimit,
            location,
            allowedHospitals,
            penalty,
            "critical"
        );

        hoax(ambulance, 100 ether);
        vm.expectRevert('not authorized');
        ab.postTender{value: 100}(
            timeLimit,
            location,
            allowedHospitals,
            penalty,
            "critical"
        );

        hoax(police, 1000 ether);
        vm.expectRevert("maxval must be greater than 0");
        ab.postTender{value: 0}(timeLimit, location, allowedHospitals, penalty,
            "critical");

        fakeHospitals.push(ambulance);
        hoax(police, 1000 ether);
        vm.expectRevert("hospital not authorized");
        ab.postTender{value: 100}(timeLimit, location, fakeHospitals, penalty,
            "critical");
    }

    // function testGetAllTenders() public view {
    //     tenders = ab.getAllTenders();

    //     assertEq(tenders.length, 0);
    // }

    function testSecretBid() public {
        vm.startPrank(admin);
        ab.addPolice(police);
        ab.addAmbulance(ambulance);
        ab.addHospital(hospital);
        allowedHospitals.push(hospital);
        vm.stopPrank();

        hoax(police, 10000000000000000 ether);
        int256 tender = ab.postTender{value: 100000000}(
            timeLimit,
            location,
            allowedHospitals,
            penalty,
            "critical"
        );

        //bytes32 hash = keccak256(abi.encode(block.timestamp, 0));
        //uint hash = bidValue + saltVal;
        uint hash = ab.hashVal(bidValue, saltVal);
        hoax(ambulance, 10 ether);
        ab.secretBid{value: penalty}(tender, hash);
    }

    // function testCannotSecretBid() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addAmbulance(ambulance);
    //     ab.addHospital(hospital);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
    //     //bytes32 hash = keccak256(abi.encode(block.timestamp, 0));
    //     uint hash = bidValue + saltVal;
    //     hoax(police, 10000000000000000 ether);
    //     int256 tender = ab.postTender{value: 100000000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );

    //     hoax(ambulance, 0 ether);
    //     vm.expectRevert();
    //     ab.secretBid{value: penalty}(tender, hash);

    //     hoax(police, 100 ether);
    //     vm.expectRevert("Sender is not an ambulance");
    //     ab.secretBid{value: penalty}(tender, hash);

    //     // skip(10000000000000000000000);
    //     // hoax(ambulance, 100 ether);
    //     // vm.expectRevert("The bidding period is over");
    //     // ab.secretBid{value: penalty}(tender, hash);

    //     hoax(ambulance, 100 ether);
    //     vm.expectRevert("amount specified does not match penalty amount");
    //     ab.secretBid{value: 0}(tender, hash);

    //     hoax(ambulance, 10 ether);
    //     ab.secretBid{value: penalty}(tender, hash);

    //     hoax(ambulance, 100 ether);
    //     vm.expectRevert("Sender has already submitted a bid");
    //     ab.secretBid{value: penalty}(tender, hash);
    // }

    // function testRevealBid() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addAmbulance(ambulance);
    //     ab.addHospital(hospital);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
      
    //     hoax(police, 10000000000000000 ether);
    //     int256 tender = ab.postTender{value: 1000000000000000000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
        
    //     // generate random int later
    //     uint256 saltVal = 10;
        
    //     //bytes32 hash = keccak256(abi.encodePacked(bidValue + saltVal));
    //     uint hash = bidValue + saltVal;
    //     //emit log_bytes32(hash);

    //     hoax(ambulance, 10 ether);
    //     ab.secretBid{value: penalty}(tender, hash);

    //     hoax(ambulance, 1000 ether);
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);
    // }

    // function testCannotRevealBid() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addAmbulance(ambulance);
    //     ab.addHospital(hospital);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
    //     // generate random int later
    //     uint256 saltVal = 10;
    //     //bytes32 hash = keccak256(abi.encodePacked(bidValue + saltVal));
    //     uint hash = bidValue + saltVal;
    //     //emit log_bytes32(hash);
    //     hoax(police, 10000000000000000 ether);
    //     int256 tender = ab.postTender{value: 10000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );

    //     hoax(ambulance, 10 ether);
    //     ab.secretBid{value: penalty}(tender, hash);

    //     hoax(ambulance, 0 ether);
    //     vm.expectRevert();
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);

    //     hoax(police, 100 ether);
    //     vm.expectRevert("Sender not an ambulance");
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);

    //     // hoax(ambulance, 1000 ether);
    //     // vm.expectRevert("The reveal period is over");
    //     // ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);

    //     // hoax(ambulance, 1000 ether);
    //     // vm.expectRevert("The reveal period has not yet started");
    //     // ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);

    //     // hoax(ambulance, 1000 ether);
    //     // vm.expectRevert("This bid is above final bid");
    //     // ab.revealBid{value: 100}(tender, bidValue, saltVal, index);

    //     // hoax(ambulance, 1000000000000 ether);
    //     // vm.expectRevert("This bid is above max bid");
    //     // ab.revealBid{value: 1000000000000}(tender, bidValue, saltVal, index);

    //     // hoax(ambulance, 1000 ether);
    //     // vm.expectRevert("Wrong index in bidder list");
    //     // ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);

    //     hoax(ambulance, 1000 ether);
    //     vm.expectRevert(
    //         "Paid amount is not equal to the required penalty amount"
    //     );
    //     ab.revealBid{value: 100000000}(tender, bidValue, saltVal, index);

    //     hoax(ambulance, 1000 ether);
    //     vm.expectRevert("incorrect bid + salt value");
    //     ab.revealBid{value: 1000}(tender, bidValue, 0, index);

    //     hoax(ambulance, 1000 ether);
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);

    //     hoax(ambulance, 1000 ether);
    //     vm.expectRevert("This tender is not open");
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);
    // }

    // function testGetWinner() public {

    // }

    // function testHashVal() public {
    //
    //}

    // function testVerifyDelivery() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addHospital(hospital);
    //     ab.addAmbulance(ambulance);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
    //     // generate random int later
    //     uint256 saltVal = 10;
    //     bytes32 hash = keccak256(abi.encodePacked(bidValue + saltVal));
    //     emit log_bytes32(hash);
    //     hoax(police, 10000000000000000 ether);
    //     int256 tender = ab.postTender{value: 1000000000000000000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
    //     vm.prank(ambulance);
    //     ab.bid(tender, hash);
    //     hoax(ambulance, 1000 ether);
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);
    //     vm.prank(hospital);
    //     ab.verifyDelivery(tender);
    // }

    // function testReclaimTender() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addHospital(hospital);
    //     ab.addAmbulance(ambulance);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
    //     // generate random int later
    //     uint256 saltVal = 10;
    //     bytes32 hash = keccak256(abi.encodePacked(bidValue + saltVal));
    //     emit log_bytes32(hash);
    //     hoax(police, 10000000000000000 ether);
    //     int256 tender = ab.postTender{value: 1000000000000000000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
    //     vm.prank(ambulance);
    //     ab.bid(tender, hash);
    //     hoax(ambulance, 1000 ether);
    //     ab.revealBid{value: 1000}(tender, bidValue, saltVal, index);
    //     vm.startPrank(police);
    //     ab.reclaimTender(tender);
    //     vm.stopPrank();
    // }

    // function testRetractTender() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addHospital(hospital);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
    //     hoax(police, 100 ether);
    //     int256 tender = ab.postTender{value: 1000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
    //     vm.startPrank(police);
    //     ab.retractTender(tender);
    //     vm.stopPrank();

    //     hoax(police, 100 ether);
    //     tender = ab.postTender{value: 1000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
    //     vm.startPrank(police);
    //     ab.retractTender(tender);
    //     vm.stopPrank();

    //     hoax(police, 100 ether);
    //     tender = ab.postTender{value: 1000}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
    //     vm.startPrank(police);
    //     ab.retractTender(tender);
    //     vm.stopPrank();
    // }

    // function testRemoveTender() public {
    //     vm.startPrank(admin);
    //     ab.addPolice(police);
    //     ab.addHospital(hospital);
    //     allowedHospitals.push(hospital);
    //     vm.stopPrank();
    //     hoax(police, 1000 ether);
    //     int256 tender = ab.postTender{value: 100}(
    //         timeLimit,
    //         location,
    //         allowedHospitals,
    //         penalty
    //     );
    //     // ab.removeTender(1);
    // }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }

    function append(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }
}
