# -*- coding: utf-8 -*-
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from collections import OrderedDict
"""
This python script is used to generate various plots based on both gas prices for smart contract functions
and the latency time for calling the smart contract functions.
There are three flags that can be used --static, --load, or --box.
A sample command 'Command format: python3 gas_time_plotter.py --flag filename',
use TXT file for --static or --load, CSV file for --box
"""

# parse the text file output for the foundry gas report for static load size, takes txt file from foundry output
def parse_gas(filename):
    # set lines to be skipped, skip 36 for auctions gas and 12 for accounts gas to remove unnecessary information
    if "auc" in filename:
        skipLines = 36
    else:
        skipLines = 12

    # set the output filename and open the given file
    outfile_name = filename[:-4:] + ".csv"
    df = pd.DataFrame(columns=["function", "minimum", "average", "median", "max", "# calls"])
    with open(filename, 'r', encoding="utf-8") as in_file, open(outfile_name, 'w') as out_file:
        i = 0

        # loop through the lines
        for line in in_file:
            # if still in skipped lines continue
            if i < skipLines:
                i += 1
                continue

            # if it is a line with values replace the special chars and write to file
            if line.startswith("â") or line.startswith("│"):
                if "Œâ" in line or '”€' in line:
                    continue
                line = line.replace("â", " ").replace("┆", ",").replace(" ", "").strip(',')
                line_arr = line[1:-2:].split(",")
                row = [line_arr[0], line_arr[1], line_arr[2], line_arr[3], line_arr[4], line_arr[5]]
                df.loc[len(df)] = row

                print(line[1:-2:].split(","))
                out_file.writelines(line[1:-2:] + "\n")
    plot_static(outfile_name, df)


# create csv to be used for loaded gas costs
def parse_load(filename):
    # set lines to be skipped, skip 36 for auctions gas and 12 for accounts gas
    if "auc" in filename:
        data_dict = {"verifyDelivery": {}, "getAuctionWinner": {}, "postTender": {},
                 "secretBid": {}, "revealBid": {}, "getAllTenders": {}}
        """"reclaimTender": {}, retractTender": {},"""
    else:
        data_dict = {"addAdmin": {}, "addAmbulance": {}, "addHospital": {}, "addInitiator": {}, "isAdmin": {}, "isAmbulance": {},
                 "isHospital": {}, "isInitiator": {}, "removeAdmin": {}, "removeAmbulance": {}, "removeHospital": {}, "removeInitiator": {}}
    
    # open the file and get all the lines
    with open(filename, 'r', encoding="utf-8") as in_file:
        lines_arr = in_file.readlines()

        lineCnt = 0
        # loop through the lines in teh array
        for line in lines_arr:
            # if the line is a break in the table, else if the line is not a data row set line count to 0
            if repr(line).startswith("'├"):
                continue
            elif not repr(line).startswith("'│"):
                lineCnt = 0
                continue

            # remove the newline and see if the line starts with another value
            line = line.replace("\n", "")
            if line.startswith("â") or line.startswith("│"):
                lineCnt += 1
                if lineCnt <= 3:
                    continue

                # replace the special characters for csv format
                line = line.replace("â", " ").replace("”†", ",").strip(',')
                line = line.replace("│", " ").replace("┆", ",").strip(',').replace(" ", "")

                # get information from the line
                line_arr = line.split(",")
                func = line_arr[0].strip()
                avg1 = line_arr[2]
                times = line_arr[5].strip()

                # if function is not in the dict continue
                if func not in data_dict.keys():
                    continue

                # add the times to the dict
                if times == "1":
                    data_dict[func]["1_avg"] = avg1.strip()
                elif times == "20":
                    data_dict[func]["20_avg"] = avg1.strip()
                elif times == "100":
                    data_dict[func]["100_avg"] = avg1.strip()
                # elif times == "500":
                #     data_dict[func]["500_avg"] = avg1.strip()
                continue
    df = pd.DataFrame(columns=['function', "1", "20", "100"])
    # get the output file name
    outfile_name = filename[:-4:].strip()

    # loop through the dictionary to write the values a dataframe
    for key, value in data_dict.items():
        if "1_avg" not in value.keys() or "20_avg" not in value.keys() or "100_avg" not in value.keys():
        #or "500_avg" not in value.keys():
            print("missing value for " + key)
        else: 
            row = [key, value["1_avg"], value["20_avg"], value["100_avg"]]
            df.loc[len(df)] = row

    plot_load(outfile_name, df)


# plot the static functions, takes csv file generated by parse_static
def plot_static(filename, df):
    data = pd.read_csv(filename)
    df2 = pd.DataFrame(data)
    df = df.iloc[1:]
    print(df)
    print(df2)
  

    # get function and gas attributes
    function_name = [str.strip() for str in list(df.iloc[:,0]) ]
    min_gas = list(df.iloc[:,1])
    avg_gas = list(df.iloc[:,2])
    med_gas = list(df.iloc[:,3])
    max_gas = list(df.iloc[:,4])

    # set number of x-axis labels and width of each bar
    x = np.arange(len(function_name))
    width = 0.2

    # generate subplots and set height/width
    fig, ax = plt.subplots()
    fig.set_figwidth(15)
    fig.set_figheight(6)

    # plot the bars
    ax.bar(x-width, min_gas, width, color='thistle', edgecolor='black', hatch='/')
    ax.bar(x, max_gas, width, color='springgreen', edgecolor='black', hatch='o')
    ax.bar(x+width, med_gas, width, color='salmon', edgecolor='black', hatch='-')
    ax.bar(x+2*width, avg_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    # plot attributes
    ax.legend(['minimum', 'maximum', 'median', 'average'], bbox_to_anchor=(1.0, 1.0), loc='upper left')
    # ax.set_title("Gas report for Smart Contract (500 calls each)")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Methods")
    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()
    plt.yscale('log')

    # save the file
    pic_filename = filename[:-4:] + ".eps"
    plt.savefig(pic_filename, format="eps", dpi=1200)
    plt.show()


# plot the loaded functions compiled, generated from csv version of load gas prices using foundry
def plot_load(filename, df):
    # print(filename)
    print(df)
    # data = pd.read_csv("account_gas_load.csv")
    # df = pd.DataFrame(data)
    # print(df)

    # get the functions and their gas prices
    function_name = [str.strip() for str in list(df.iloc[:, 0])]
    one_gas = list(df.iloc[:, 1])
    twenty_gas = list(df.iloc[:, 2])
    hund_gas = list(df.iloc[:, 3])
    #fivehund_gas = list(df.iloc[:, 4])

    # set the number of bars needed and the width of each bar
    x = np.arange(len(function_name))
    width = 0.2

    # create the subplots
    fig, ax = plt.subplots()

    # plot the individual bars for eacch gas amount
    ax.bar(x - width, one_gas, width, color='thistle', edgecolor='black', hatch='/')
    ax.bar(x, twenty_gas, width, color='springgreen', edgecolor='black', hatch='o')
    ax.bar(x + width, hund_gas, width, color='salmon', edgecolor='black', hatch='-')
    #ax.bar(x + 2 * width, fivehund_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    # plot attributes
    ax.legend(['1', '20', '100'], loc='upper right')
    #ax.set_title("Load Factor Gas Report for Auction API Calls")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Method")
    plt.yscale("log")
    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()

    # save the figure as vectorized image
    plt_filename = filename + ".eps"
    plt.savefig(plt_filename, format="eps", dpi=1200)
    plt.show()


# create a boxplot for API latency times from given CSV file generated by truffle tests (ran w/ --box flag)
def plot_box(filename):
    # open the file and create pandas dataframe
    data = pd.read_csv(filename)
    df = pd.DataFrame(data)

    # generate the boxplot
    df.boxplot()

    # plot attributes
    plt.xticks(rotation=45, ha='right', fontsize=8)
    plt.xlabel("Smart Contract Methods")
    plt.ylabel("Latency Time (s)")
    plt.grid(visible=False)

    # save the figure as a vectorized image for quality
    plt_filename = filename[:-4:] + ".eps"
    plt.savefig(plt_filename, format="eps", dpi=1200)
    


# if it is the load text run load function else run standard gas function
if sys.argv[1] == "--static":
    parse_gas(sys.argv[2])
elif sys.argv[1] == "--load":
    parse_load(sys.argv[2])

elif sys.argv[1] == "--box":
    plot_box(sys.argv[2])
else:
    print("Please specify a flag (--static, --load, or --box)")
    print("Command format: python3 gas_time_plotter.py --flag filename")
    print("TXT file for --static or --load, CSV file for --box")

