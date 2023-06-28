import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np


def plot_all(filename):
    print(filename)
    data = pd.read_csv(filename)

    df = pd.DataFrame(data)
    print(df)

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
    plt.yscale('log')
    rec1 = ax.bar(x-width, min_gas, width, color='thistle', edgecolor='black', hatch='/')
    rec2 = ax.bar(x, max_gas, width, color='springgreen', edgecolor='black', hatch='o')
    rec3 = ax.bar(x+width, med_gas, width, color='salmon', edgecolor='black', hatch='-')
    rec4 = ax.bar(x+2*width, avg_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    ax.legend(['minimum', 'maximum', 'median', 'average'], bbox_to_anchor=(1.0, 1.0), loc='upper left')
    # ax.set_title("Gas report for Smart Contract (500 calls each)")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Methods")

    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()

    picFilename = filename[:-4:] + ".eps"
    plt.savefig(picFilename, format="eps", dpi=1200)


def plot_load(filename):
    data = pd.read_csv(filename)

    df = pd.DataFrame(data)
    print(df)

    function_name = [str.strip() for str in list(df.iloc[:, 0])]
    one_gas = list(df.iloc[:, 1])
    twenty_gas = list(df.iloc[:, 2])
    hund_gas = list(df.iloc[:, 3])
    #fivehund_gas = list(df.iloc[:, 4])

    x = np.arange(len(function_name))
    width = 0.2

    fig, ax = plt.subplots()
    #fig.set_figheight(8)

    plt.yscale("log")
    rec1 = ax.bar(x - width, one_gas, width, color='thistle', edgecolor='black', hatch='/')
    rec2 = ax.bar(x, twenty_gas, width, color='springgreen', edgecolor='black', hatch='o')
    rec3 = ax.bar(x + width, hund_gas, width, color='salmon', edgecolor='black', hatch='-')
    #rec4 = ax.bar(x + 2 * width, fivehund_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    ax.legend(['1', '20', '100'], loc='upper right')

    #ax.set_title("Load Factor Gas Report for Auction API Calls")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Method")

    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()
    pltFilename = filename[:-4:] + ".eps"
    plt.savefig(pltFilename, format="eps", dpi=1200)


# if it is the load text run load function else run standard gas function
if sys.argv[1] == "--load":
    plot_load(sys.argv[2])
else:
    plot_all(sys.argv[1])
