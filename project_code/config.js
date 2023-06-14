/* Fuji */
//export const contractAddress = '0x082e7A9a334D700acac0da58427Cc96492D88c43'

/* Sepolia */
export const contractAddress = '0x97A6646C4DF420149463194Ad970E9De98D6d986';

// contract addresses for both contracts
export const accountsAddress = '';
export const auctionsAddress = '';

export const accounts_abi = [];
export const auctions_abi = [];

export const ambulance_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "BidIndex",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "str",
        "type": "string"
      }
    ],
    "name": "Message",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "int256",
        "name": "index",
        "type": "int256"
      }
    ],
    "name": "PostIndex",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tenderIds",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "name": "tenderMapping",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "tenderPoster",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "tenderAccepter",
        "type": "address"
      },
      {
        "internalType": "enum AmbulanceBounties.TenderStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "postDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "dueDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "maxBid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "penalty",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "finalBid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "severity",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tenders",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "tenderPoster",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "tenderAccepter",
        "type": "address"
      },
      {
        "internalType": "enum AmbulanceBounties.TenderStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "postDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "dueDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "maxBid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "penalty",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "finalBid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "severity",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ambAddress",
        "type": "address"
      }
    ],
    "name": "isAmbulance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "polAddress",
        "type": "address"
      }
    ],
    "name": "isPolice",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "hosAddress",
        "type": "address"
      }
    ],
    "name": "isHospital",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "adminAddress",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timeLimit",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "allowedHospitals",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "penalty",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "severity",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "postTender",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [],
    "name": "getAllTenders",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "tenderPoster",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "tenderAccepter",
            "type": "address"
          },
          {
            "internalType": "enum AmbulanceBounties.TenderStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "postDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dueDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "address[]",
            "name": "allowedHospitals",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "maxBid",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "penalty",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "bidders",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "bidHashArray",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "finalBid",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "severity",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "tenderId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "internalType": "struct AmbulanceBounties.Tender[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "tenderId",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "bidHashedAmount",
        "type": "uint256"
      }
    ],
    "name": "secretBid",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "tenderId",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "bidValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "salt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "revealBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "tenderId",
        "type": "int256"
      }
    ],
    "name": "getWinner",
    "outputs": [
      {
        "internalType": "address",
        "name": "tenderWinner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "tenderId",
        "type": "int256"
      }
    ],
    "name": "verifyDelivery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "tenderId",
        "type": "int256"
      }
    ],
    "name": "reclaimTender",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "tenderId",
        "type": "int256"
      }
    ],
    "name": "retractTender",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "addAmbulance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ambulance",
        "type": "address"
      }
    ],
    "name": "removeAmbulance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "addPolice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "police",
        "type": "address"
      }
    ],
    "name": "removePolice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "addHospital",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "hospital",
        "type": "address"
      }
    ],
    "name": "removeHospital",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "bidValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "salt",
        "type": "uint256"
      }
    ],
    "name": "hashVal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  }
];
