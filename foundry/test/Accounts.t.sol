pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

import "../src/AmbulanceBounties.sol";

// SPDX-License-Identifier: UNLICENSED

contract AccountsTest is Test {

    function setUp() public {
         // set this address as the admin address and create instance of the AmbulanceBounties contract
        admin = 0xAd6cacC05493c496b53CCa73AB0ADf0003cB2D80;
        vm.startPrank(admin);
        ab = new AmbulanceBounties();
        vm.stopPrank();
    }

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
}