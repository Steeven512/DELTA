Delta Provides a easy and smooth interface for manage Based Tokens erc20 and regulated stable coins, 
handle and retrieve data from multiple chains and build a local side-chain database for local indexing
by secuencial syncing to latest chain block.

 
block explorer event for Tokens

    indexing data events: transactions, mint, burn and some events of Regulated Stables coins 

    specific option filter events and intervals by block number.

    multichain indexing: select the specific network and displays the events data

charts  monitor

    transaction volume, amount, burned and mint on timeline.

Address indexer

    shows the balances and events of the specific address

Transfer

    demonstrative implementation of transfers and bridge between chains.

admin panel

    manage the network settings and smart contract functions.




build 

    dependencies: g++, crow server, Boost.Python, boost, web3py

    g++ SRC/ethEventsListener.cpp -o BIN/eventslistener -I/usr/include/python3.11 -lboost_python311 -lpython3.11  -lssl -lcrypto -lcryptopp -std=c++17

    g++ SRC/manageApp.cpp -o BIN/manageApp -lpthread -DCROW_ENABLE_SSL -lssl -lcrypto -lcryptopp -std=c++17

deployment smart contract

    brownie run regulatedStableCoin.sol --network ganache

    then set the smart contract deployment address in PyScripts/ContractObj.py contract_address var


setup
