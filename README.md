build 

    g++ SRC/ethEventsListener.cpp -o BIN/eventslistener -I/usr/include/python3.11 -lboost_python311 -lpython3.11  -lssl -lcrypto -lcryptopp -std=c++17

    g++ SRC/manageApp.cpp -o BIN/manageApp -lpthread -DCROW_ENABLE_SSL -lssl -lcrypto -lcryptopp -std=c++17

deployment smart contract

    brownie run regulatedStableCoin.sol --network ganache

    then set the smart contract deployment address in PyScripts/ContractObj.py contract_address var
