// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

import "./Accounts.sol";

/* Add in both auction due date and delivery due date */
/* Figure out fix to hashVal in JavaScript */
/* Re-evaluate legacy auction system */
contract Auctions {
    // Use Accounts contract
    Accounts ac;

    // constants
    uint256 constant MAX_INT = 2**256 - 1;

    // data members for contract
    int256[] public tenderIds; // list of all tenders
    mapping(int256 => Tender) public tenderMapping; // mapping for faster tender lookup
    Tender[] public tenders;
    int256 tenderIdCounter = 0;


    // enum for various possible tender status's, closed is default
    enum TenderStatus {
        Closed,
        InProgress,
        Open,
        Retracted,
        Reclaimed
    }

    // struct to hold tender information
    struct Tender {
        address payable tenderPoster;
        address payable tenderAccepter;
        TenderStatus status;
        uint256 postDate;
        uint256 dueDate;
        // Should be a string that represents the coordinates of the patient, compliant with ISO 6709
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

        // tender data for frontend
        string severity;
        uint tenderId;
    }

    /*
    * Function creates new tender
    *
    * Takes auction time limit, location of incident (address, city, and state)
    * penalty amount, severity, etc. as parameters
    *
    * Note: msg.value is the max bid
    */
    function postTender(
        uint256 timeLimit,
        string memory addr,
        string memory city,
        string memory state,
        uint256 penalty,
        string memory severity,
        address[] memory allowedHospitals
    ) public payable returns (uint256) {
        // require statements for function
        require(ac.isAdmin(msg.sender), "sender must be an admin");
        require(msg.value > 0, "maxval must be greater than 0");

        // validate allowed hospitals are valid hospitals
        for (uint256 i = 0; i < allowedHospitals.length; i++) {
            require(ac.isHospital(allowedHospitals[i]));
        }

        // initalize new tender information
        Tender memory newTender;
        newTender.tenderId = uint(tenderIdCounter);
        newTender.tenderPoster = payable(msg.sender);
        newTender.status = TenderStatus.Open; // open tender
        
        newTender.postDate = block.timestamp; // set post date to current time
        newTender.dueDate = block.timestamp + timeLimit; // set due date for auction

        newTender.finalBid = MAX_INT; // set to max possible integer
        newTender.maxBid = msg.value;
        newTender.penalty = penalty;

        newTender.addr = addr;
        newTender.city = city;
        newTender.state = state;
        newTender.severity = severity;
        
        // push new tender and adjust mappings
        tenders.push(newTender); 
        tenderMapping[tenderIdCounter] = newTender;
        tenderIdCounter++;
        return newTender.tenderId;
    }

    function secretBid(int256 tenderId, uint bidHashedAmount) public payable returns(uint256 index) {
        Tender memory tender = tenderMapping[tenderId];
        require(ac.isAmbulance(msg.sender), "sender must be an ambulance");
        require(tender.status == TenderStatus.Open, "tender must be open");
    
        require (block.timestamp < tender.dueDate, "auction period has passed");
        require(msg.value == tender.penalty, "sent penalty amount does not match tender");
        require(!contains(tender.bidders, msg.sender), "can only bid once");

        // add bid to array
        tenderMapping[tenderId].bidders.push(msg.sender);
        tenderMapping[tenderId].bidHashArray.push(bidHashedAmount);
        return tender.bidders.length - 1;
    }

    function revealBid(
        int256 tenderId,
        uint256 bidVal,
        uint256 salt,
        uint256 index
    ) public payable {
        Tender storage tender = tenderMapping[tenderId];
        require(ac.isAmbulance(msg.sender), "sender must be ambulance");
        require(block.timestamp > tender.dueDate, "tender still under auction");
        require(tender.status == TenderStatus.Open, "tender is not open");
        require(bidVal < tender.finalBid, "bid was not the lowest");
        require(bidVal < tender.maxBid, "bid was not the lowest");
        require(msg.sender == tender.bidders[index], "wrong bid ID");
        require(tender.penalty == msg.value, "did not send correct penalty amount");
        require(tender.bidHashArray[index] == hashVal(bidVal, salt), "bid value does not match hashed value");

        // if job was already assigned, refund 
        if (tender.tenderAccepter != address(0)) {
            tender.tenderAccepter.transfer(
                tender.penalty
            );
        }
        
        // update tender information
        tender.status = TenderStatus.InProgress;
        tender.tenderAccepter = payable(msg.sender);
        tender.finalBid = bidVal;

        // set new info to tender mapping
        tenderMapping[tenderId] = tender;
    }

    // This sucks, but it's one of the consequences of storing everything on the blockchain
    function contains(address[] memory addresses, address addressToFind) private pure returns (bool doesContain) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] == addressToFind) {
                return true;
            }
        }
        return false;
    }

    // bad fix to hash values in javascript
    function hashVal(uint bidValue, uint salt) public pure returns (uint) {
        
        return uint(keccak256(abi.encodePacked(bidValue + salt)));
    }
}