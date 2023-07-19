// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.0;

import "./Accounts.sol";

contract Auctions {
    // initialize accounts contract
    Accounts accountsContract;

    // constants
    uint256 constant MAX_INT = 2**256 - 1;
    uint256 constant REVEAL_PERIOD = 300;

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
        string zipcode;
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

    // constructor, references the Accounts contract address
    constructor(address contractAddress) {
        accountsContract = Accounts(contractAddress);
    }

    /*
    * Function posts new tender from initiator and begins the auction for the tender
    *
    * @param timeLimit - length of the auction period
    * @param deliveryTime - how long the ambulance has to transport the patient after auction and reveal
    * @param addr - address of the tender location
    * @param city - city of the tender location
    * @param state - state of the tender location
    * @param penalty - penalty amount charged for lack of delivery for accepted tender
    * @param severity - severity of the tender patient
    * @param allowedHospitals - list of valid hospitals to be transported to
    * @returns - returns the id of the new tender posted
    * Note: msg.value is the max bid
    */
    function postTender(
        uint256 timeLimit,
        uint256 deliveryTime,
        string memory addr,
        string memory city,
        string memory state,
        string memory zipcode,
        uint256 penalty,
        string memory severity,
        address[] memory allowedHospitals
    ) public payable returns (uint256) {
        require(accountsContract.isInitiator(msg.sender), "sender must be tender initiator");
        require(msg.value > 0, "maxval must be greater than 0");

        // validate allowed hospitals given are valid hospitals
        for (uint256 i = 0; i < allowedHospitals.length; i++) {
            require(accountsContract.isHospital(allowedHospitals[i]), "given hospital list invalid");
        }

        // initalize new tender information
        Tender memory newTender;
        newTender.tenderId = tenderIdCounter;
        newTender.details.tenderPoster = payable(msg.sender);
        newTender.status = TenderStatus.Open; // open tender
        
        // set important dates for tender
        newTender.details.postDate = block.timestamp; // set post date to current time
        newTender.details.auctionDate = block.timestamp + timeLimit; // sets auction end date w/ time limit given
        newTender.details.revealDate = block.timestamp + timeLimit + REVEAL_PERIOD; // sets reveal peiod end date
        newTender.details.dueDate = block.timestamp + timeLimit + REVEAL_PERIOD + deliveryTime; // set due date for tender

        // set tender information
        newTender.details.finalBid = MAX_INT; // set current bid to max possible integer
        newTender.details.maxBid = msg.value; // set maximum bid to msg.value
        newTender.details.penalty = penalty;
        newTender.details.allowedHospitals = allowedHospitals;

        // patient location and details
        newTender.details.addr = addr;
        newTender.details.city = city;
        newTender.details.state = state;
        newTender.details.zipcode = zipcode;
        newTender.details.severity = severity;
        
        // push new tender and adjust mappings accordingly
        tenders.push(newTender); 
        tenderMapping[tenderIdCounter] = newTender;
        tenderIdCounter++;
        return newTender.tenderId;
    }

    event BidPlaced(uint256 tenderId, uint256 bidId);

    /*
    * Function places a secret bid by an ambulance. Each ambulance receives only 1 bid
    *
    * @param tenderId - the ID of the tender being bid on
    * @param bidHashedAmount - the hash value of the bid being places (bid + random salt value)
    * @returns the ID of the ambulances bid, used for revealing
    */
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
        emit BidPlaced(tenderId, tenderMapping[tenderId].details.bidders.length - 1);
        return tenderMapping[tenderId].details.bidders.length - 1;
    }

    /*
    * Function is used to reveal winning bids after the auction period ends
    * 
    * @param tenderId - ID of tender being revealed
    * @param bidVal - amount bid by the ambulance
    * @param saltVal - the random salt integer used in secretBid
    * @param index - index of placed secret bid
    */
    function revealBid(
        uint256 tenderId,
        uint256 bidVal,
        uint256 salt,
        uint256 index
    ) public payable {
        Tender storage tender = tenderMapping[tenderId];
        require(accountsContract.isAmbulance(msg.sender), "sender must be ambulance");
        require(block.timestamp > tender.details.auctionDate, "tender still under auction");
        require(block.timestamp < tender.details.revealDate, "tender is past reveal period");
        require(tender.status == TenderStatus.Open, "tender is not open");
        //require(bidVal < tender.details.finalBid, "bid was not below winning bid");
        require(bidVal < tender.details.maxBid, "bid was not below max bid amount");
        require(msg.sender == tender.details.bidders[index], "wrong bid ID");
        require(tender.details.penalty == msg.value, "did not send correct penalty amount");
        require(tender.details.bidHashArray[index] == uint256(keccak256(abi.encodePacked(bidVal + salt))), "bid value does not match hashed value");

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

    /*
    * this function is called upon delivery of a patient where the ambulance is then paid for delivery
    *
    * @param tenderId - id of the tender where delivery is being verified 
    */
    function verifyDelivery(uint256 tenderId) public {
        require(accountsContract.isHospital(msg.sender), "Sender must be a hospital");
        require(
            tenderMapping[tenderId].status == TenderStatus.InProgress,
            "Tender not in progress"
        );
        require(
            block.timestamp >
                tenderMapping[tenderId].details.revealDate,
            "Tender is not ready to be claimed yet"
        );

        /* remove after implementing late charge */
        require(
            block.timestamp < tenderMapping[tenderId].details.dueDate,
            "Tender has expired"
        );
        require(contains(tenderMapping[tenderId].details.allowedHospitals, msg.sender), "sender not an allowed hospitals");

        /* potentially add paying without penalty amount if late */ 
        // transfer agreed upon funds to the tender accepter
        tenderMapping[tenderId].details.tenderAccepter.transfer(
            tenderMapping[tenderId].details.finalBid + tenderMapping[tenderId].details.penalty
        );

        // transfer funds back to the tender poster
        if (tenderMapping[tenderId].details.maxBid - tenderMapping[tenderId].details.finalBid > 0) {
            tenderMapping[tenderId].details.tenderPoster.transfer(
                tenderMapping[tenderId].details.maxBid -
                    tenderMapping[tenderId].details.finalBid
            );
        }
        
        // close the tender
        Tender storage referencedTender = tenderMapping[tenderId];
        referencedTender.status = TenderStatus.Closed;
        tenderMapping[tenderId] = referencedTender;
    }

    /*
     * get all the tenders present in tenders array
     *
     * @returns all tenders on the blockchain
     */
    function getAllTenders() public view returns (Tender[] memory) {
        return tenders;
    }

    /*
     * Get a tender from a given tenderID
     *
     * @param tenderId - given tenderID
     *
     * @returns a single tender with given tenderId
     */
     function getTender(uint256 tenderId) public view returns (Tender memory) {
        return tenderMapping[tenderId];
     }

    /*
     * get the winner of an auction
     *
     * @param tenderId - given tender ID
     */
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

    /*
     * allows police stations to reclaim their funds + the penalty for failed jobs
     *
     * @param tenderId - ID of tender being retracted
     */
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

        // update status of the tender
        tenderMapping[tenderId].status = TenderStatus.Reclaimed;
    }

    /*
     * remove a tender with auction in progress from auction period 
     *
     * @param tenderId - ID of tender being retracted
     */
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

        // update status of the tender
        tenderMapping[tenderId].status = TenderStatus.Retracted;
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
}