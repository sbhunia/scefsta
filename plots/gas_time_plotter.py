# -*- coding: utf-8 -*-
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from collections import OrderedDict

# parse the text file output for the foundry gas report for static load size
def parse_gas(filename):
    # set lines to be skipped, skip 36 for auctions gas and 12 for accounts gas
    if "auc" in filename:
        skipLines = 36
    else:
        skipLines = 12

    # set the output filename and open the given file
    outfile_name = filename[:-4:] + ".csv"
    with open(filename, 'r') as in_file, open(outfile_name, 'w') as out_file:
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
                print(line[1:-2:])
                out_file.writelines(line[1:-2:] + "\n")
    plot_all(outfile_name)

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
    with open(filename, 'r') as in_file:
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

    # write to file
    outfile_name = filename[:-4:] + ".csv"
    out_file = open(outfile_name, "w")
    out_file.write("Function Name, 1, 20, 100 \n")

    # loop through the dictionary to write the values to the file
    for key, value in data_dict.items():
        if "1_avg" not in value.keys() or "20_avg" not in value.keys() or "100_avg" not in value.keys():
        #or "500_avg" not in value.keys():
            print("missing value for " + key)
        else: 
            line = key + "," + value["1_avg"] + "," + value["20_avg"] + "," + value["100_avg"] + "\n" 
            #+"," + value["500_avg"] + "\n"
        out_file.write(line)

    plot_load(outfile_name)


# plot the static functions
def plot_all(filename):
    data = pd.read_csv(filename)
    df = pd.DataFrame(data)
    print(df)

    # get function and gas attributes
    function_name = [str.strip() for str in list(df.iloc[:,0]) ]
    min_gas = list(df.iloc[:,1])
    avg_gas = list(df.iloc[:,2])
    med_gas = list(df.iloc[:,3])
    max_gas = list(df.iloc[:,4])

    x = np.arange(len(function_name))
    width = 0.2

    fig, ax = plt.subplots()
    fig.set_figwidth(15)
    fig.set_figheight(6)

    # plot the bars
    rec1 = ax.bar(x-width, min_gas, width, color='thistle', edgecolor='black', hatch='/')
    rec2 = ax.bar(x, max_gas, width, color='springgreen', edgecolor='black', hatch='o')
    rec3 = ax.bar(x+width, med_gas, width, color='salmon', edgecolor='black', hatch='-')
    rec4 = ax.bar(x+2*width, avg_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    # plot attributes
    ax.legend(['minimum', 'maximum', 'median', 'average'], bbox_to_anchor=(1.0, 1.0), loc='upper left')
    # ax.set_title("Gas report for Smart Contract (500 calls each)")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Methods")
    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()
    plt.yscale('log')

    # save the file
    picFilename = filename[:-4:] + ".eps"
    plt.savefig(picFilename, format="eps", dpi=1200)


# plot the loaded functions compiled
def plot_load(filename):
    data = pd.read_csv(filename)
    df = pd.DataFrame(data)
    print(df)

    # get the functions and their gas prices
    function_name = [str.strip() for str in list(df.iloc[:, 0])]
    one_gas = list(df.iloc[:, 1])
    twenty_gas = list(df.iloc[:, 2])
    hund_gas = list(df.iloc[:, 3])
    #fivehund_gas = list(df.iloc[:, 4])

    x = np.arange(len(function_name))
    width = 0.2

    fig, ax = plt.subplots()
    #fig.set_figheight(8)

    # plot the information
    rec1 = ax.bar(x - width, one_gas, width, color='thistle', edgecolor='black', hatch='/')
    rec2 = ax.bar(x, twenty_gas, width, color='springgreen', edgecolor='black', hatch='o')
    rec3 = ax.bar(x + width, hund_gas, width, color='salmon', edgecolor='black', hatch='-')
    #rec4 = ax.bar(x + 2 * width, fivehund_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    # plot attributes
    ax.legend(['1', '20', '100'], loc='upper right')
    #ax.set_title("Load Factor Gas Report for Auction API Calls")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Method")
    plt.yscale("log")
    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()

    # save the figure
    pltFilename = filename[:-4:] + ".eps"
    plt.savefig(pltFilename, format="eps", dpi=1200)


# if it is the load text run load function else run standard gas function
if sys.argv[1] == "--load" and not sys.argv[2] == "--img":
    parse_load(sys.argv[2])
elif (sys.argv[1] == "--load" and sys.argv[2] == "--img") or (sys.argv[1] == "--img" and sys.argv[2] == "--load"):
    plot_load(sys.argv[3])
elif sys.argv[1] == "--img":
    plot_all(sys.argv[2])
else:
    parse_gas(sys.argv[1])
