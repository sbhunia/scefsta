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

    rec1 = ax.bar(x-width, np.log(min_gas), width, color='thistle', edgecolor='black', hatch='/')
    rec2 = ax.bar(x, np.log(max_gas), width, color='springgreen', edgecolor='black', hatch='o')
    rec3 = ax.bar(x+width, np.log(med_gas), width, color='salmon', edgecolor='black', hatch='-')
    rec4 = ax.bar(x+2*width, np.log(avg_gas), width, color='lightseagreen', edgecolor='black', hatch='\\')

    # rec1 = ax.bar(x-width, np.log(max), width, color='b')
    # rec2 = ax.bar(x, np.log(avg), width, color='r')
    # rec3 = ax.bar(x+width, np.log(min), width, color='g')
    # rec4 = ax.bar(x+2*width, np.log(med), width, color='y')

    ax.legend(['minimum', 'maximum', 'median', 'average'], loc='upper left')

    ax.set_title("Gas report for Smart Contract (100 calls each)")
    ax.set_ylabel("Gas consumed (log-scale)")
    ax.set_xlabel("API Called")

    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()

    picFilename = filename[:-4:] + ".eps"
    plt.savefig(picFilename, format="eps", dpi=1200)


def plot_load():
    data = pd.read_csv('gas_price_load.csv')

    df = pd.DataFrame(data)
    print(df)

    function_name = [str.strip() for str in list(df.iloc[:, 0])]
    one_gas = list(df.iloc[:, 1])
    twenty_gas = list(df.iloc[:, 2])
    hund_gas = list(df.iloc[:, 3])
    fivehund_gas = list(df.iloc[:, 4])

    x = np.arange(len(function_name))
    width = 0.2

    fig, ax = plt.subplots()
    #fig.set_figheight(8)

    rec1 = ax.bar(x - width, np.log(one_gas), width, color='thistle', edgecolor='black', hatch='/')
    rec2 = ax.bar(x, np.log(twenty_gas), width, color='springgreen', edgecolor='black', hatch='o')
    rec3 = ax.bar(x + width, np.log(hund_gas), width, color='salmon', edgecolor='black', hatch='-')
    rec4 = ax.bar(x + 2 * width, np.log(fivehund_gas), width, color='lightseagreen', edgecolor='black', hatch='\\')

    # rec1 = ax.bar(x-width, np.log(max), width, color='b')
    # rec2 = ax.bar(x, np.log(avg), width, color='r')
    # rec3 = ax.bar(x+width, np.log(min), width, color='g')
    # rec4 = ax.bar(x+2*width, np.log(med), width, color='y')

    ax.legend(['1', '20', '100', '500'], loc='upper right')

    ax.set_title("Load Factor Gas Report for Auction API Calls")
    ax.set_ylabel("Gas consumed (log-scale)")
    ax.set_xlabel("API Called")

    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()

    plt.savefig("api_load.eps", format="eps", dpi=1200)


plot_all(sys.argv[1])
#plot_load()
