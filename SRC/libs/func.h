#include "../libs/pythonw3.h"
#include "../thirdparty/json.hpp"

#ifndef func_H
#define func_H

using namespace std;

void signalHandler(int signum) {
    std::cout << "exit call (" << signum << ") .\n";
    exit(signum);
}

bool checkJson(const std::string& jsonString) {
    try {
        json parsedJson = json::parse(jsonString);
        return true; 
    } catch (const json::parse_error& e) {
        std::cerr << "invalid json: " << e.what() << std::endl;
        return false; 
    }
    return false; 
}

bool noConsecutivePeriods(const std::string& input) {
    for (size_t i = 0; i < input.length() - 1; i++) {
        if (input[i] == '.' && input[i + 1] == '.') {
            return false;
        }
    }
    return true;
}

string AdminSM(std::string jsonStr){

    json jsonOptions = json::parse(jsonStr);

    loadnetworks();

    string rpc_address = Networks[jsonOptions["network"]].rpc_address;
    string sm_address = Networks[jsonOptions["network"]].sm_address;

    if(rpc_address.length() == 0 || rpc_address.length() == 0 ){
        return "the selected network does not exist";
    }

    string result = SmOperation(rpc_address, sm_address, jsonStr);

    return result;

}

string Transfer(std::string jsonStr){

    string result;
    json jsonOptions = json::parse(jsonStr);
    loadnetworks();

    string from_rpc_address = Networks[jsonOptions["network"]].rpc_address;
    string from_sm_address = Networks[jsonOptions["network"]].sm_address;

    string to_rpc_address = Networks[jsonOptions["network"]].rpc_address;
    string to_sm_address = Networks[jsonOptions["network"]].sm_address;

    if(from_rpc_address.length() == 0 || from_sm_address.length() == 0 || to_rpc_address.length() == 0 || to_sm_address.length() == 0){
        return "the selected network does not exist";
    }

    if(from_rpc_address == to_rpc_address &&  from_sm_address == to_sm_address){

        result = SmOperation(from_rpc_address, from_sm_address, jsonStr);

    } else {

        cout<<endl<<"transaction bridge "<<endl;
        result = SmOperation(to_rpc_address, to_sm_address, jsonStr);

    }

    return result;

}

void storeSmartContracInfo(std::string network){

    string jsonSrt = "{\"option\": \"SmartContracInfo\"}";
    string rpc_address = Networks[network].rpc_address;
    string sm_address = Networks[network].sm_address;

    try {

        cout<<endl<<" storeSmartContracInfo "<<endl;

        string tokenInfo =  SmOperation(rpc_address, sm_address, jsonSrt);

        if(tokenInfo == "py error catched" || !checkJson(tokenInfo)){
            return;
        }

        storeSmartContracInfoDB(network, json::parse(tokenInfo));

    } catch(const std::invalid_argument& e) {

    }

}

string DerivePublicKey(string PK){

    string address =  DerivePublicKeyWeb3(PK);

    return address;

}

#endif