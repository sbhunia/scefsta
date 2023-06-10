pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED

contract AmbulanceBounties {
    // 30 second long bid window for ambulances to place their bids (for testing)
    uint256 constant BID_PERIOD_LENGTH = 300;
    // 30 second long reveal window for ambulances to verify their bids (for testing)
    uint256 constant REVEAL_PERIOD_LENGTH = 300;

    // Required length for the salt used in tenderIding bids
    uint256 constant SALT_LENGTH = 10;

    uint256 constant MAX_INT = 2**256 - 1;

    address public admin;

    // constructor for the contract, assigns admin to creator
    constructor() {
        admin = msg.sender;
    }

    // We map addresses to their permissions. If an address maps to true, that means it is verified as that role.
    // Using a mapping instead of an array for these roles gives us O(1) insertion, deletion, and lookup since we can simply set the value to false to remove them.
    // However, we cannot get a list of all keys in the mapping without also storing an array of the keys. If this is necessary, then we
    // should abandon the mapping idea.

    mapping(address => bool) ambulances;
    mapping(address => bool) policeStations;
    mapping(address => bool) hospitals;

    // returns true if address is an ambulance, false if not
    function isAmbulance(address ambAddress) public view returns (bool) {
        if (ambulances[ambAddress] == true) return true;
        else return false;
    }

    // returns true if address is an poice, false if not
    function isPolice(address polAddress) public view returns (bool) {
        if (policeStations[polAddress] == true) return true;
        else return false;
    }

    // returns true if address is a hospital, false if not
    function isHospital(address hosAddress) public view returns (bool) {
        if (hospitals[hosAddress] == true) return true;
        else return false;
    }

    // returns true if address is an admin, false if not
    function isAdmin(address adminAddress) public view returns (bool) {
        if (adminAddress == admin) return true;
        else return false;
    }

    // Closed is the first option in the enum so that it is the default option
    enum TenderStatus {
        Closed,
        InProgress,
        Open
    }

    // struct to hold Tender information including, police who posts the tender (tenderPoster), the ambulance who wins the bid (tenderAccepter)
    // The tender status (Closed, InProgress, Open), post date, due date, the location the tender was created, the allowed hospitals
    // for deliver in a given tender, the maximum bid (set by the poster), the penalty (lost if patient is not delivered on time),
    // the bidders, the bid hash array which is the bid + salt value, as well as the final bid which is the highest bid
    struct Tender {
        address payable tenderPoster;
        address payable tenderAccepter;
        TenderStatus status;
        uint256 postDate;
        uint256 dueDate;
        // Should be a string that represents the coordinates of the patient, compliant with ISO 6709
        string location;
        address[] allowedHospitals;
        uint256 maxBid;
        uint256 penalty;
        // Maps an address to its bid. This enforces one bid per address, so that ambulances do not just bid as many prices as they can, and then reveal lower and lower bids during the reveal period.
        // We use 2 arrays because we can't have nested mappings in Solidity.
        address[] bidders;
        uint[] bidHashArray;
        uint256 finalBid;

        // tender data for frontend
        string severity;
        uint tenderId;
    }

    // Note: We maintain an array so that we can see all tenders, and a mapping for fast tender information lookup
    // The string is the "ID" of the tender, and the Tender object is the actual object. Together, these two data structures form something like a Set data structure.
    int256[] public tenderIds;
    mapping(int256 => Tender) public tenderMapping;
    Tender[] public tenders;

    // constructor(address[] memory a, address[] memory p, address[] memory h) {
    //     admin = msg.sender;

    //     for (uint i = 0; i < a.length; i++) {
    //         ambulances[a[i]] = true;
    //     }

    //     for (uint i = 0; i < p.length; i++) {
    //         policeStations[p[i]] = true;
    //     }

    //     for (uint i = 0; i < h.length; i++) {
    //         hospitals[h[i]] = true;
    //     }

    // }

    // timeLimit is how long (minutes) the ambulances have to deliver the patient, not including bid and reveal times.
    // TODO: allowedHospitals

    event PostIndex(int256 index);

    int256 tenderIdCounter = 0;

    event Message(string str);

    // this function is used by police to post a tender for hospitals to bid on
    function postTender(
        uint256 timeLimit,
        string memory location,
        address[] memory allowedHospitals,
        uint256 penalty,
        string memory severity
    ) public payable returns (int256) {
        require(policeStations[msg.sender], "not authorized");
        require(msg.value > 0, "maxval must be greater than 0");
        for (uint256 i = 0; i < allowedHospitals.length; i++) {
            require(hospitals[allowedHospitals[i]], "hospital not authorized");
        }

        // The reason we make a new object has something to do with Solidity and how it treats the memory keyword
        Tender memory newTender;
        newTender.tenderPoster = payable(msg.sender);
        newTender.status = TenderStatus.Open;
        newTender.postDate = block.timestamp;
        newTender.dueDate =
            block.timestamp +
            BID_PERIOD_LENGTH +
            REVEAL_PERIOD_LENGTH +
            timeLimit;
        newTender.location = location;
        newTender.allowedHospitals = allowedHospitals;
        newTender.maxBid = msg.value;
        newTender.penalty = penalty;
        newTender.finalBid = MAX_INT;
        newTender.severity = severity;
        newTender.tenderId = uint(tenderIdCounter);

        tenderIds.push(tenderIdCounter);
        tenders.push(newTender);

        tenderMapping[tenderIdCounter] = newTender;
        emit PostIndex(tenderIdCounter++);
        return tenderIdCounter - 1;
    }

    // returns all tenders
    function getAllTenders() public view returns (Tender[] memory) {
        return tenders;
    }

    // Unfortunately, we force the ambulances to iterate over the whole list of bidders when they want to bid.
    // This can be fixed by not storing all of the tender information on the blockchain.
    // The tenderIded amount should be an amount in wei + a 10 digit salt. Note that if the tender is tenderIded with a salt that is not 10 digits long, the bid will be invalid.
    // This value should then be encoded from a string to a hex value using abi.encode, and then passed through the keccak256 tenderId function (hex input)

    event BidIndex(uint256 index);

    // CHANGES - moved the hashing/encoding into the function when adding to tenderMapping, salt now needed as arguments
    /** tenderId - ID of tender
        salt - salt used to encrypt bid
        NOTE: bidValue is msg.value
     */
    function secretBid(int256 tenderId, uint bidHashedAmount)
        public
        payable
        returns (uint256 index)
    {
        require(ambulances[msg.sender]);
        require(
            tenderMapping[tenderId].status == TenderStatus.Open
        );

        require(
            block.timestamp <
                tenderMapping[tenderId].postDate + BID_PERIOD_LENGTH
        );
        require(
            !contains(tenderMapping[tenderId].bidders, msg.sender)
        );

        // penalty amount will need converted inside the frontend
        require(
            msg.value == tenderMapping[tenderId].penalty);

        tenderMapping[tenderId].bidders.push(msg.sender);
        emit BidIndex(tenderMapping[tenderId].bidders.length - 1);
        tenderMapping[tenderId].bidHashArray.push(bidHashedAmount);
        return tenderMapping[tenderId].bidders.length - 1;
    }

    // Currently, if two ambulances made the same bid, the one that reveals its bid first will win
    /**
        tenderId - ID of tender
        bidValue - value of the bid
        salt - salt used to encrypt bid
        index - index of the bid itself (returned from the bid function as an event)
     */
    function revealBid(
        int256 tenderId,
        uint256 bidValue,
        uint256 salt,
        uint256 index
    ) public payable {
        // Sender must be ambulance
        require(ambulances[msg.sender]);
        // Must be in the reveal period
        require(
            block.timestamp <
                tenderMapping[tenderId].postDate +
                    BID_PERIOD_LENGTH +
                    REVEAL_PERIOD_LENGTH
        );
        require(
            block.timestamp >= tenderMapping[tenderId].postDate + 0
        );
        // Tender must be open (i.e. not retracted)
        require(
            tenderMapping[tenderId].status == TenderStatus.Open
        );
        // Bid must be less than the current lowest bid
        require(
            bidValue < tenderMapping[tenderId].finalBid
        );
        // Bid must be less than the current lowest bid
        require(
            bidValue < tenderMapping[tenderId].maxBid
        );
        // Revealer must provide the correct id for the bidder list
        require(
            msg.sender == tenderMapping[tenderId].bidders[index]
        );

        // Sender must pay the penalty amount to reveal the bid, which will be refunded on job completion
        require(
            tenderMapping[tenderId].penalty == msg.value
        );
        // Salt must be 10 digits long
        // require(bytes(uint2str(salt)).length == SALT_LENGTH, "Salt is not the correct length");
        // Hashed bid must match the bid value.
        // 0x + keccak256 of the abi.encoded value is what the client should pass as the tenderIded bid. For the bidvalue, they can just pass regular (unpadded) wei values
        require(
            tenderMapping[tenderId].bidHashArray[index] ==
                hashVal(bidValue, salt)
        );
        //keccak256(abi.encode(append(uint2str(bidValue), uint2str(salt)))), "The bid value does not match the tenderId");

        Tender storage referencedTender = tenderMapping[tenderId];

        // If we already assigned someone to take the job earlier in the reveal period, refund that ambulance's penalty since they no longer have the job
        if (referencedTender.tenderAccepter != address(0)) {
            referencedTender.tenderAccepter.transfer(
                tenderMapping[tenderId].penalty
            );
        }

        referencedTender.status = TenderStatus.InProgress;
        referencedTender.tenderAccepter = payable(msg.sender);
        referencedTender.finalBid = bidValue;

        tenderMapping[tenderId] = referencedTender;
    }

    /**
     * This function will verify and return the winner of the auction
     */
    function getWinner(int256 tenderId)
        public
        view
        returns (address tenderWinner)
    {
        require(
            tenderMapping[tenderId].status == TenderStatus.InProgress
        );
        require(
            block.timestamp <
                tenderMapping[tenderId].postDate +
                    BID_PERIOD_LENGTH +
                    REVEAL_PERIOD_LENGTH
        );

        return tenderMapping[tenderId].tenderAccepter;
    }

    // this function is called upon delivery of a patient where the ambulance is then paid for delivery
    function verifyDelivery(int256 tenderId) public {
        require(hospitals[msg.sender], "Sender not authorized");
        require(
            tenderMapping[tenderId].status == TenderStatus.InProgress,
            "Tender not in progress"
        );
        require(
            block.timestamp <
                tenderMapping[tenderId].postDate +
                    BID_PERIOD_LENGTH +
                    REVEAL_PERIOD_LENGTH,
            "Tender is not ready to be claimed yet"
        );
        require(
            block.timestamp < tenderMapping[tenderId].dueDate,
            "Tender has expired"
        );
        require(contains(tenderMapping[tenderId].allowedHospitals, msg.sender));

        tenderMapping[tenderId].tenderAccepter.transfer(
            tenderMapping[tenderId].finalBid + tenderMapping[tenderId].penalty
        );

        if (
            tenderMapping[tenderId].maxBid - tenderMapping[tenderId].finalBid >
            0
        ) {
            tenderMapping[tenderId].tenderPoster.transfer(
                tenderMapping[tenderId].maxBid -
                    tenderMapping[tenderId].finalBid
            );
        }

        Tender storage referencedTender = tenderMapping[tenderId];

        referencedTender.status = TenderStatus.Closed;

        tenderMapping[tenderId] = referencedTender;

        removeTender(tenderId);
    }

    // Allows police stations to reclaim their funds + the penalty for failed jobs
    function reclaimTender(int256 tenderId) public {
        require(
            tenderMapping[tenderId].tenderPoster == msg.sender
        );
        require(
            tenderMapping[tenderId].status == TenderStatus.InProgress
        );
        require(
            tenderMapping[tenderId].tenderAccepter != address(0)
        );
        require(tenderMapping[tenderId].dueDate > block.timestamp);

        tenderMapping[tenderId].tenderPoster.transfer(
            tenderMapping[tenderId].maxBid + tenderMapping[tenderId].penalty
        );

        removeTender(tenderId);
    }

    function retractTender(int256 tenderId) public {
        require(
            msg.sender == tenderMapping[tenderId].tenderPoster
        );
        require(
            tenderMapping[tenderId].status == TenderStatus.Open
        );

        // can only retract a tender if bid period is over (need to add)
        tenderMapping[tenderId].tenderPoster.transfer(
            tenderMapping[tenderId].maxBid
        );

        removeTender(tenderId);
    }

    function removeTender(int256 tenderId) private {
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
                tenders[i].tenderPoster == tender.tenderPoster &&
                tenders[i].tenderAccepter == tender.tenderAccepter &&
                tenders[i].postDate == tender.postDate
            ) {
                tenders[i] = tenders[tenders.length - 1];
                tenders.pop();
            }
        }

        // If we can assume that the tender ids (the tenderIdes that go into tenderMapping) are properly generated,
        // we don't have to delete any data from the tenderMapping
    }

    // Allows the admin to add verified ambulances
    function addAmbulance(address addr) public {
        // verify account does not already have another role
        require(ambulances[addr] != true);
        require(hospitals[addr] != true);
        require(policeStations[addr] != true);
        // verify the address is not an admin and the sender is an admin
        require(addr != admin);
        require(msg.sender == admin);

        // if passes all requires add account to ambulances
        ambulances[addr] = true;
    }

    // Allows the admin to remove verified ambulances
    function removeAmbulance(address ambulance) public {
        require(msg.sender == admin);
        require(ambulances[ambulance] != false);
        ambulances[ambulance] = false;
    }

    // Allows the admin to add verified police stations
    function addPolice(address addr) public {
        // verify account does not already have another role
        require(ambulances[addr] != true);
        require(hospitals[addr] != true);
        require(policeStations[addr] != true);
        // verify the address is not an admin and the sender is an admin
        require(addr != admin);
        require(msg.sender == admin);

        // if passes all requires add the address as police
        policeStations[addr] = true;
    }

    // Allows the admin to remove verified police stations
    function removePolice(address police) public {
        require(msg.sender == admin);
        require(policeStations[police] != false);
        policeStations[police] = false;
    }

    // Allows the admin to add verified hospitals
    function addHospital(address addr) public {
         // verify account does not already have another role
        require(ambulances[addr] != true, "already an ambulance");
        require(hospitals[addr] != true, "already a hospital");
        require(policeStations[addr] != true, "already a police");
        // verify the address is not an admin and the sender is an admin
        require(addr != admin, "already an admin");
        require(msg.sender == admin, "sender is not an admin");

        // if passes all requires add account to hospitals
        hospitals[addr] = true;
    }

    // Allows the admin to remove verified hospitals
    function removeHospital(address hospital) public {
        require(msg.sender == admin);
        require(hospitals[hospital] != false);
        hospitals[hospital] = false;
    }

    // This sucks, but it's one of the consequences of storing everything on the blockchain
    function contains(address[] memory addresses, address addressToFind)
        private
        pure
        returns (bool doesContain)
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] == addressToFind) {
                return true;
            }
        }
        return false;
    }

    function hashVal(uint bidValue, uint salt) public pure returns (uint) {
        
        return uint(keccak256(abi.encodePacked(bidValue + salt)));
    }

    // helper method for the contract
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

    // helper method for the contract
    function append(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }
}
