To compile new gas plots
1. run command in foundry directory: "forge test --match-test testAuctionGasTimes --gas-report > ../plots/auction_gas_static.txt || cd ../plots" for test to get gas times
2. run command in plot directory: "python3 parser.py auction_gas_static.txt" to create the corresponding CSV file
3. run command in plot directory: ""