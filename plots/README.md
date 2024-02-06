To compile new gas plots
flags --img: plot image requires csv file, --load: compiles the gas prices for load factors
1. for static gas prices: run command in foundry directory: "forge test --match-test testAuctionGasTimes --gas-report > ../plots/auction_gas_static.txt" for test to get gas times
2. for load gas prices: run command in foundry directory: "forge test --match-test testAuctionGasTimes --gas-report >> ../plots/auction_gas_static.txt" for test to get gas times
    1. ensure you change the loop count in ContractGas.t.sol
3. Move to plots directory and run command: python3 gas_time_plotter.py filename.
    1. flags can be added between python file and filename
    2. adjust filename based off of goal outcome (.txt for file parsing and .csv for plotting)
