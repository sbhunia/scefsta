# -*- coding: utf-8 -*-
import sys
import pandas as pd
from collections import OrderedDict

# parse the text file output for the foundry gas report for static load size
def parse_gas(filename):
    # set lines to be skipped, skip 36 for auctions gas and 12 for accounts gas
    if "auc" in filename:
        skipLines = 36
    else:
        skipLines = 12

    # set the output filename and open the given file
    outfileName = filename[:-4:] + ".csv"
    with open(filename, 'r') as in_file, open(outfileName, 'w') as out_file:
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

# create csv to be used for loaded gas costs
def parse_load(filename):
    # functions to consider
    data_dict = {"addAmbulance": {}, "addHospital": {}, "addPolice": {}, "isAdmin": {}, "isAmbulance": {},
                 "isHospital": {}, "isPolice": {}, "removeAmbulance": {}, "removeHospital": {}, "removePolice": {},
                 "verifyDelivery": {}, "reclaimTender": {}, "retractTender": {}, "getWinner": {}, "postTender": {},
                 "secretBid": {}, "revealBid": {}}

    # set lines to be skipped, skip 36 for auctions gas and 12 for accounts gas
    if "auc" in filename:
        skipLines = 36
    else:
        skipLines = 12
    # open the file and get all the lines
    with open(filename, 'r') as in_file:
        lines_arr = in_file.readlines()

        # loop through the lines in teh array
        for line in lines_arr:
            if line.startswith("â") or line.startswith("│"):
                lineCnt += 1
                if not inTable:
                    inTable = True
                print(lineCnt)
                # if lineCnt <= 5:
                #     continue
                # if "Œâ" in line or '”€' in line or lineCnt <= 4:
                #     lineCnt += 1
                #     continue
                # if "├" in line:
                #     continue
                print(line)
                # # replace the special characters for csv format
                # line = line.replace("â", " ").replace("”†", ",").strip(',')
                # line = line.replace("│", " ").replace("┆", ",").strip(',')
                # print(line)

                # # get information from the line
                # line_arr = line.split(",")
                # func = line_arr[0][2::].strip()
                # avg1 = line_arr[2]
                # times = line_arr[5][:-3:].strip()

                # # add the times to the dict
                # if times == "1":
                #     data_dict[func]["1_avg"] = avg1.strip()
                # elif times == "20":
                #     data_dict[func]["20_avg"] = avg1.strip()
                # elif times == "100":
                #     data_dict[func]["100_avg"] = avg1.strip()
                # elif times == "500":
                #     data_dict[func]["500_avg"] = avg1.strip()
            elif not line.startswith("╭") or not line.startswith("╞") or not line.startswith("├") or not line.startswith("╰"):
                inTable = False
                lineCnt = 0

    # print(data_dict)
    # outfileName = filename[:-4:] + ".csv"
    # out_file = open(outfileName, "w")
    # out_file.write("Function Name, 1, 20, 100, 500 \n")

    # # loop through the dictionary to write the values to the file
    # for key, value in data_dict.items():
    #     print(key)
    #     line = key + "," + value["1_avg"] + "," + value["20_avg"] + "," + value["100_avg"] + "," + value["500_avg"] + "\n"
    #     print(line)
    #     out_file.write(line)

    # data_dict = OrderedDict()

    # data_dict["postTender"] = {}
    # data_dict["secretBid"] = {}
    # data_dict["revealBid"] = {}
    # data_dict["getWinner"] = {}

    # first_line = True
    # with open("auction_gas.txt", 'r') as in_file:
    #     lines_arr = in_file.readlines()
    #     for line in lines_arr:
    #         if line.startswith("â"):
    #             if "Œâ" in line or '”€' in line or first_line:
    #                 first_line = False
    #                 continue
    #             line = line.replace("â", " ").replace("”†", ",").strip(',')
    #             line_arr = line.split(",")
    #             func = line_arr[0][3::].strip()
    #             avg1 = line_arr[2]
    #             times = line_arr[5][:-3:].strip()
    #             if times == "1":
    #                 data_dict[func]["1_avg"] = avg1.strip()
    #             elif times == "20":
    #                 data_dict[func]["20_avg"] = avg1.strip()
    #             elif times == "100":
    #                 data_dict[func]["100_avg"] = avg1.strip()
    #             elif times == "500":
    #                 data_dict[func]["500_avg"] = avg1.strip()

    # out_file = open("gas_price_load.csv", "w")
    # out_file.write("Function Name, 1, 20, 100, 500 \n")
    # for key, value in data_dict.items():
    #     line = key + "," + value["1_avg"] + "," + value["20_avg"] + "," + value["100_avg"] + "," + value["500_avg"] + "\n"
    #     print(line)
    #     out_file.write(line)


if sys.argv[1] == "--load":
    parse_load(sys.argv[2])
else:
    parse_gas(sys.argv[1])
