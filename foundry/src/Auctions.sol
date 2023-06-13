// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

import "./Accounts.sol";

/* Add in both auction due date and delivery due date */
/* Figure out fix to hashVal in JavaScript */
/* Re-evaluate legacy auction system */
contract Auctions {
    // initialize accounts contract
    Accounts accountsContract;

    // constants
    uint256 constant MAX_INT = 2**256 - 1;
    uint256 constant REVEAL_PERIOD = 5000;

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

    // data members for tenders
    uint256[] public tenderIds; // list of all tenders
    mapping(uint256 => Tender) public tenderMapping; // mapping for faster tender lookup
    Tender[] public tenders;
    uint256 tenderIdCounter = 0;

    // constructor 
    constructor(address contractAddress) {
        accountsContract = Accounts(contractAddress);
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
        uint256 deliveryTime,
        string memory addr,
        string memory city,
        string memory state,
        uint256 penalty,
        string memory severity,
        address[] memory allowedHospitals
    ) public payable returns (uint256) {
        //require statements for function
        require(accountsContract.isInitiator(msg.sender), "sender must be tender initiator");
        require(msg.value > 0, "maxval must be greater than 0");

        // validate allowed hospitals are valid hospitals
        for (uint256 i = 0; i < allowedHospitals.length; i++) {
            require(accountsContract.isHospital(allowedHospitals[i]), "given hospital list invalid");
        }

        // initalize new tender information
        Tender memory newTender;
        newTender.tenderId = tenderIdCounter;
        newTender.details.tenderPoster = payable(msg.sender);
        newTender.status = TenderStatus.Open; // open tender
        
        newTender.details.postDate = block.timestamp; // set post date to current time
        newTender.details.auctionDate = block.timestamp + timeLimit;
        newTender.details.revealDate = block.timestamp + timeLimit + REVEAL_PERIOD;
        newTender.details.dueDate = block.timestamp + timeLimit + REVEAL_PERIOD + deliveryTime; // set due date for auction

        newTender.details.finalBid = MAX_INT; // set to max possible integer
        newTender.details.maxBid = msg.value;
        newTender.details.penalty = penalty;
        newTender.details.allowedHospitals = allowedHospitals;

        newTender.details.addr = addr;
        newTender.details.city = city;
        newTender.details.state = state;
        newTender.details.severity = severity;
        
        // push new tender and adjust mappings
        tenders.push(newTender); 
        tenderMapping[tenderIdCounter] = newTender;
        tenderIdCounter++;
        return newTender.tenderId;
    }

    function secretBid(uint256 tenderId, uint256 bidHashedAmount) public payable returns(uint256 index) {
        Tender memory tender = tenderMapping[tenderId];
        require(accountsContract.isAmbulance(msg.sender), "sender must be an ambulance");
        require(tender.status == TenderStatus.Open, "tender must be open");
    
        require (block.timestamp < tender.details.dueDate, "auction period has passed");
        require(msg.value == tender.details.penalty, "sent penalty amount does not match tender");
        require(!contains(tender.details.bidders, msg.sender), "can only bid once");

        // add bid to array
        tenderMapping[tenderId].details.bidders.push(msg.sender);
        tenderMapping[tenderId].details.bidHashArray.push(bidHashedAmount);
        return tenderMapping[tenderId].details.bidders.length - 1;
    }

    function revealBid(
        uint256 tenderId,
        uint256 bidVal,
        uint256 salt,
        uint256 index
    ) public payable {
        Tender storage tender = tenderMapping[tenderId];
        require(accountsContract.isAmbulance(msg.sender), "sender must be ambulance");
        /* ignored for test contract */
        //require(block.timestamp > tender.details.dueDate, "tender still under auction");
        require(block.timestamp < tender.details.revealDate, "tender is past reveal period");
        require(tender.status == TenderStatus.Open, "tender is not open");
        require(bidVal < tender.details.finalBid, "bid was not the lowest");
        require(bidVal < tender.details.maxBid, "bid was not the lowest");
        require(msg.sender == tender.details.bidders[index], "wrong bid ID");
        require(tender.details.penalty == msg.value, "did not send correct penalty amount");
        require(tender.details.bidHashArray[index] == hashVal(bidVal, salt), "bid value does not match hashed value");

        // if job was already assigned, refund 
        if (tender.details.tenderAccepter != address(0)) {
            tender.details.tenderAccepter.transfer(
                tender.details.penalty
            );
        }
        
        // update tender information
        tender.status = TenderStatus.InProgress;
        tender.details.tenderAccepter = payable(msg.sender);
        tender.details.finalBid = bidVal;

        // set new info to tender mapping
        tenderMapping[tenderId] = tender;
    }

    // this function is called upon delivery of a patient where the ambulance is then paid for delivery
    function verifyDelivery(uint256 tenderId) public {
        require(accountsContract.isHospital(msg.sender), "Sender must be a hospital");
        require(
            tenderMapping[tenderId].status == TenderStatus.InProgress,
            "Tender not in progress"
        );
        require(
            block.timestamp <
                tenderMapping[tenderId].details.dueDate,
            "Tender is not ready to be claimed yet"
        );
        /* change due dates */
        require(
            block.timestamp < tenderMapping[tenderId].details.dueDate,
            "Tender has expired"
        );
        require(contains(tenderMapping[tenderId].details.allowedHospitals, msg.sender), "sender not an allowed hospitals");

        tenderMapping[tenderId].details.tenderAccepter.transfer(
            tenderMapping[tenderId].details.finalBid + tenderMapping[tenderId].details.penalty
        );

        if (tenderMapping[tenderId].details.maxBid - tenderMapping[tenderId].details.finalBid > 0) {
            tenderMapping[tenderId].details.tenderPoster.transfer(
                tenderMapping[tenderId].details.maxBid -
                    tenderMapping[tenderId].details.finalBid
            );
        }

        Tender storage referencedTender = tenderMapping[tenderId];
        referencedTender.status = TenderStatus.Closed;
        tenderMapping[tenderId] = referencedTender;
        
        /* Need to figure out if I want to remove the tenders on delivery */
        removeTender(tenderId);
    }

    //get all tenders
    function getAllTenders() public view returns (Tender[] memory) {
        return tenders;
    }

    // get the winner of an auction
    function getAuctionWinner(uint256 tenderId) public view returns (address tenderWinner) {
        require(
            tenderMapping[tenderId].status != TenderStatus.Open,
            "no winner for open tender"
        );
        require(
            block.timestamp <
                tenderMapping[tenderId].details.revealDate,
                "tender must be past reveal period"
        );

        return tenderMapping[tenderId].details.tenderAccepter;
    } 

    // Allows police stations to reclaim their funds + the penalty for failed jobs
    function reclaimTender(uint256 tenderId) public {
        require(
            tenderMapping[tenderId].details.tenderPoster == msg.sender,
            "sender is not the tender poster"
        );
        require(
            tenderMapping[tenderId].status == TenderStatus.InProgress,
            "tender is not in progress"
        );
        require(
            tenderMapping[tenderId].details.tenderAccepter != address(0),
            "tender accepter is not the address set"
        );
        require(tenderMapping[tenderId].details.dueDate > block.timestamp, "auction period is over");

        tenderMapping[tenderId].details.tenderPoster.transfer(
            tenderMapping[tenderId].details.maxBid + tenderMapping[tenderId].details.penalty
        );

        removeTender(tenderId);
    }

    function retractTender(uint256 tenderId) public {
        require(
            msg.sender == tenderMapping[tenderId].details.tenderPoster,
            "sender is not the tender poster"
        );
        require(
            tenderMapping[tenderId].status == TenderStatus.Open,
            "tender is not open"
        );

        // can only retract a tender if bid period is over (need to add)
        tenderMapping[tenderId].details.tenderPoster.transfer(
            tenderMapping[tenderId].details.maxBid
        );

        removeTender(tenderId);
    }

    function removeTender(uint256 tenderId) private {
        // Delete doesn't preserve order, but we can at the cost of more processing
        Tender memory tender;
        for (uint256 i = 0; i < tenders.length; i++) {
            // Comparing the strings
            if (tenderIds[i] == tenderId) {
                tender = tenderMapping[tenderId];
                tenders[i] = tenders[tenders.length - 1];
                tenders.pop();
            }
        }
        for (uint256 i = 0; i < tenders.length; i++) {
            if (
                tenders[i].details.tenderPoster == tender.details.tenderPoster &&
                tenders[i].details.tenderAccepter == tender.details.tenderAccepter &&
                tenders[i].details.postDate == tender.details.postDate
            ) {
                tenders[i] = tenders[tenders.length - 1];
                tenders.pop();
            }
        }
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
    function hashVal(uint256 bidValue, uint256 salt) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(bidValue + salt)));
    }
}