pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";

import "../src/Accounts.sol";

// SPDX-License-Identifier: UNLICENSED

contract AccountsTest is Test {
    Accounts public a;
    address superAdmin;

    // accounts to be used
    address admin;
    address ambulance;
    address initiator;
    address hospital;
    
    // results
    bool res;

    function setUp() public {
         // set this address as the admin address and create instance of the AmbulanceBounties contract
        superAdmin = vm.addr(1);
        vm.startPrank(superAdmin);
        a = new Accounts();
        vm.stopPrank();

        // addresses to be used for testing
        admin = vm.addr(1);
        ambulance = vm.addr(1);
        initiator = vm.addr(1);
        hospital = vm.addr(1);
    }

    function testAddIsRemoveAdmin() public {
        // set sender as super admin
        vm.startPrank(superAdmin);
            // verify isAdmin works
            res = a.isAdmin(admin);
            assertEq(res, false);

            // verify adding admin
            a.addAdmin(admin);
            res = a.isAdmin(admin);
            assertEq(res, true);

            // verify removing admin
            a.removeAdmin(admin);
            res = a.isAdmin(admin);
            assertEq(res, false);
        vm.stopPrank();
    }

    function testAddIsRemoveAmbulance() public {
        vm.startPrank(admin);
        bool res = a.isAmbulance(ambulance);
        assertEq(res, false);

        a.addAmbulance(ambulance);
        res = a.isAmbulance(ambulance);
        assertEq(res, true);

        a.removeAmbulance(ambulance);
        res = a.isAmbulance(ambulance);
        assertEq(res, false);

        res = a.isAmbulance(initiator);
        assertEq(res, false);
        vm.stopPrank();
    }
}