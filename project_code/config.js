// contract addresses for both contracts
// sample deployment addresses
export const accountsAddress = '0xbC771e92306a85Ed56453B3BB53b14937d73a7e8';
export const auctionsAddress = '0x6230e3674575F53B07b38DBFB6E5f9561285fc9C';

export const accounts_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "superAdmin",
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
        "internalType": "address",
        "name": "addr",
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
        "name": "addr",
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
    "name": "isInitiator",
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
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "addInitiator",
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
    "name": "removeInitiator",
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
        "name": "addr",
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
        "internalType": "address",
        "name": "addr",
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
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "addAdmin",
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
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const auctions_abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
    "name": "tenderMapping",
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
            "internalType": "uint256",
            "name": "postDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "auctionDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "revealDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dueDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "addr",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "state",
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
          }
        ],
        "internalType": "struct Auctions.TenderDetails",
        "name": "details",
        "type": "tuple"
      },
      {
        "internalType": "enum Auctions.TenderStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
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
            "internalType": "uint256",
            "name": "postDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "auctionDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "revealDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dueDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "addr",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "state",
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
          }
        ],
        "internalType": "struct Auctions.TenderDetails",
        "name": "details",
        "type": "tuple"
      },
      {
        "internalType": "enum Auctions.TenderStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "deliveryTime",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "addr",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "state",
        "type": "string"
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
        "internalType": "address[]",
        "name": "allowedHospitals",
        "type": "address[]"
      }
    ],
    "name": "postTender",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bidVal",
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
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
      }
    ],
    "name": "verifyDelivery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTenders",
    "outputs": [
      {
        "components": [
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
                "internalType": "uint256",
                "name": "postDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "auctionDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "revealDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "dueDate",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "addr",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "city",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "state",
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
              }
            ],
            "internalType": "struct Auctions.TenderDetails",
            "name": "details",
            "type": "tuple"
          },
          {
            "internalType": "enum Auctions.TenderStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "tenderId",
            "type": "uint256"
          }
        ],
        "internalType": "struct Auctions.Tender[]",
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
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
      }
    ],
    "name": "getTender",
    "outputs": [
      {
        "components": [
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
                "internalType": "uint256",
                "name": "postDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "auctionDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "revealDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "dueDate",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "addr",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "city",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "state",
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
              }
            ],
            "internalType": "struct Auctions.TenderDetails",
            "name": "details",
            "type": "tuple"
          },
          {
            "internalType": "enum Auctions.TenderStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "tenderId",
            "type": "uint256"
          }
        ],
        "internalType": "struct Auctions.Tender",
        "name": "",
        "type": "tuple"
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
        "name": "tenderId",
        "type": "uint256"
      }
    ],
    "name": "getAuctionWinner",
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
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "tenderId",
        "type": "uint256"
      }
    ],
    "name": "retractTender",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
