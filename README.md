# Background
This capstone project is an extension of a previous capstone project. The goal of this project is to create competition between EMS companies using blockchain technology. This capstone project will add features and optimize the legacy system created by the other capstone team.

# Installation
The following instructions show how to set up and deploy this project

Prepare project for running on local host:
- Clone into your local computer
- Open the project in vs-code or other IDE
- Move into ambulance-incentive-system directory
- run command "npm install"
- run command "npm install @usedapp/core"

Set up Metamask:
- Download MetaMask extension in chrome
- Create an account and set up Avalanche Fuji-wallet
    - https://docs.alchemy.com/docs/how-to-add-avalanche-to-metamask

Run on localhost: 
- Move into ambulance-incentive-system directory
- run command "npm run dev"

Farm Fuji testnet AVAX:
AVAX is the currency used for this DApp and you can farm fake AVAX using the following link
- https://faucet.avax.network/

# Troubleshooting
- If it says the cache is full, delete .next directory and recompile 
- For openSSL error:(bash) "export NODE_OPTIONS=--openssl-legacy-provider" (windows) "set NODE_OPTIONS=--openssl-legacy-provider"
- If npm install is failing (mac m1 or m2 chip error), look up https://stackoverflow.com/questions/68896696/having-trouble-installing-npm-on-mac-m1
    - need to download nvm to perform this fix 

# Deploying Avalanche Smart Contract
** Only perform this step if you are the contract owner **

- Setup wallet with metamask & avalanche Fuji testnet
- Download ganache: sudo npm install -g ganache
- Good links for deploying on Avalanche with Infura:
    - Tutorial: https://dzone.com/articles/how-to-deploy-an-erc-20-smart-contract-on-avalanch
    - Infura:  https://app.infura.io/dashboard
    - Verify contract: https://testnet.snowtrace.io/


 

