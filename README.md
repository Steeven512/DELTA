# ▲ DELTA: Easy Management & Tracing Platform for Stablecoins

**DELTA**  Streamlined and efficient interface for managing and tracing regulated stablecoin operations. Seamlessly interact with your digital assets and gain deep insights into their lifecycle across multiple blockchain networks.

**Key Features:**

**🔗 Multi-Chain Data Handling & Local Indexing:**

* Effortlessly retrieve and manage data from various blockchain networks.
* Build a local side-chain database for rapid indexing and querying.
* Maintain up-to-date information through sequential syncing with the latest blockchain blocks.

**🔎 Advanced Block Explorer for Tokens:**

* **Comprehensive Event Indexing:** Track crucial on-chain events, including transactions, minting, burning, and specific events related to regulated stablecoins.
* **Precise Event Filtering:** Utilize specific options to filter events based on type and define custom block number intervals.
* **Multi-Chain Exploration:** Select your desired network and instantly visualize relevant event data.

**📊 Interactive Monitoring Charts:**

* Visualize key metrics over time:
    * Transaction Volume
    * Transaction Amount
    * Tokens Burned
    * Tokens Minted
      
**🔑 Local Wallet Management & Transaction Handling:**

* Provides an interface for managing user wallets, securely storing them locally with encryption.
* Enables users to initiate and manage transactions directly from the front-end using a built-in signer powered by Ethers.js.

**👤 In-Depth Address Indexer:**

* Quickly view the current balances of any specified address.
* Access a detailed history of events associated with a particular address.

**⚙️ Powerful Admin Panel:**

* Easily manage network configurations.
* Interact with and control smart contract functionalities.

## 🛠️ Build Instructions

**Dependencies:**

Ensure the following dependencies are installed on your system:

* `g++` (GNU C++ Compiler)
* `crow-server` (A fast and lightweight C++ web framework)
* `Boost C++ Libraries`
* `Boost.Python`
* `Web3.py` (Python library for interacting with Ethereum)
* `nlohmann json` 

**Compilation:**

Execute the following commands in your terminal to build the project:

 
```bash
 g++ SRC/ethEventsListener.cpp -o BIN/eventslistener -I/usr/include/python3.11 -lboost_python311 -lpython3.11 -std=c++17
 g++ SRC/manageApp.cpp -o BIN/manageApp -I/usr/include/python3.11 -lboost_python311 -lpython3.11 -std=c++17

```

🚀 Execution
To run DELTA, you need to execute the compiled binaries:

**Run the Data Synchronizer:**

```bash
./BIN/eventslistener

```

This process will connect to the configured Ethereum-based blockchain RPC(s) and synchronize specific events into the local database.

Run the Web Application Server:

```bash
./BIN/manageApp

```

This will start the web application server, making the DELTA interface accessible through your web browser at the following address: http://127.0.0.1:12015/CryptoAdmin.

**Important:** Upon the first execution of the web application, you will need to configure at least one network through the DELTA interface accessible via the above address. Navigate to the settings section to add the necessary network parameters (RPC URL, Chain ID, Token Contract Address, etc.).


## ⚙️ Configuration

For detailed instructions on how to configure DELTA for specific networks, please refer to [CONFIGURATION.md](CONFIGURATION.md).
