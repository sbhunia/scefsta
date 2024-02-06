# Background
This thesis project is an extension of a previous capstone project. The goal of this project is to create competition between EMS companies using blockchain technology. This capstone project will add features and optimize the legacy system created by the other capstone team. The thesis project added several new and novel functionalities such as selecting specific a     hospital(s), implementing a penalty function, refined the auction platform, created smart contract testing and diagnostics, and added functional domains to the auction system (Private, Emergency, Inter-facility).

# Installation
The following instructions show how to set up and deploy this project

Prepare project for running on local host:
- Clone into your local computer
- Open the project in vs-code or other IDE
- Move into the "project_code" directory
- run command "npm install"
- run command "npm install @usedapp/core"

Set up Metamask (can be done from deployed):
- Download MetaMask extension in chrome
- Create an account and set up Sepolia wallet (under test wallets)
    - Tutorial to add avalanche depending on contract dpeloyment
    - https://docs.alchemy.com/docs/how-to-add-avalanche-to-metamask

Run on localhost: 
- Move into "project_code" directory
- run command "NODE_OPTIONS=--openssl-legacy-provider"
- run command "npm run dev"

# Troubleshooting
- If it says the cache is full, delete .next directory and recompile 
- For openSSL error at compilation: "export NODE_OPTIONS=--openssl-legacy-provider"
- If npm install is failing (mac m1 or m2 chip error), look up https://stackoverflow.com/questions/68896696/having-trouble-installing-npm-on-mac-m1
    - need to download nvm and change node version to perform fix above


# Deploying Smart Contract
## Network utilized
The current iteration of this software is deployed on Sepolia, an Ethereum test network. This allows for easy development that is free to use. The network can be changed easily by setting up MetaMask with the desired network, and adding the 

Test network faucets to gain test cryptocurrency
- Ethereum's Sepolia: https://sepoliafaucet.com/
- Avalanche's AVAX: https://faucet.avax.network/

## Tutorial
** Only perform this step if you are the contract owner **
- Setup wallet with metamask & testnet to be used
- Download ganache: sudo npm install -g ganache
- Good links for deploying on Avalanche with Infura:
    - The new contract will be deployed in the truffle directory
    - Tutorial: https://dzone.com/articles/how-to-deploy-an-erc-20-smart-contract-on-avalanch
    - Infura:  https://app.infura.io/dashboard
    - Verify contract: https://testnet.snowtrace.io/
- Once you have deployed the new contract:
    - Add the new contract address to /project_code/config.js and remove the old one
    - Get the contract ABI from /truffle/build (one for Accounts and one for Auctions)
        - 


 

