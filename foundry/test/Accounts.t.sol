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

    // initialize some variables
    function setUp() public {
        // set this address as the admin address and create instance of the AmbulanceBounties contract
        superAdmin = vm.addr(1);
        vm.prank(superAdmin);
        a = new Accounts();

        // addresses to be used for testing
        admin = vm.addr(2);
        ambulance = vm.addr(3);
        initiator = vm.addr(4);
        hospital = vm.addr(5);
    }

    // test adding, removing, and isAccount functionality for admins
    function testAddIsRemoveAdmin() public {
        // see if the superAdmin is an admin by default
        res = a.isAdmin(superAdmin);
        assertEq(res, true);

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

    // test adding, removing, and isAccount functionality for ambulances
    function testAddIsRemoveAmbulance() public {
        // see if the superAdmin is an ambulance by default
        res = a.isAmbulance(superAdmin);
        assertEq(res, true);
        // add new admin
        vm.prank(superAdmin);
        a.addAdmin(admin);
     
        // test ambulance functions
        vm.startPrank(admin);
            // test is function
            res = a.isAmbulance(ambulance);
            assertEq(res, false);

            // test add function
            a.addAmbulance(ambulance);
            res = a.isAmbulance(ambulance);
            assertEq(res, true);

            // test remove function
            a.removeAmbulance(ambulance);
            res = a.isAmbulance(ambulance);
            assertEq(res, false);
        vm.stopPrank();
    }

    // test adding, removing, and isAccount functionality for initiators
    function testAddIsRemoveInitiator() public {
        // see if the superAdmin is an initiator by default
        res = a.isInitiator(superAdmin);
        assertEq(res, true);

        // add new admin
        vm.prank(superAdmin);
        a.addAdmin(admin);
     
        // test initiator functions
        vm.startPrank(admin);
            // test is function
            res = a.isInitiator(initiator);
            assertEq(res, false);

            // test add function
            a.addInitiator(initiator);
            res = a.isInitiator(initiator);
            assertEq(res, true);

            // test remove function
            a.removeInitiator(initiator);
            res = a.isInitiator(initiator);
            assertEq(res, false);
        vm.stopPrank();
    }

    // test adding, removing, and isAccount functionality for hospitals
    function testAddIsRemoveHospital() public {
        // see if the superAdmin is a hospital by default
        res = a.isHospital(superAdmin);
        assertEq(res, true);

        // add new admin
        vm.prank(superAdmin);
        a.addAdmin(admin);
     
        // test hospital functions
        vm.startPrank(admin);
            // test is function
            res = a.isHospital(hospital);
            assertEq(res, false);

            // test add function
            a.addHospital(hospital);
            res = a.isHospital(hospital);
            assertEq(res, true);

            // test remove function
            a.removeHospital(hospital);
            res = a.isHospital(hospital);
            assertEq(res, false);
        vm.stopPrank();
    }
}