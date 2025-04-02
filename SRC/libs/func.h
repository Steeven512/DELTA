#include "../libs/pythonw3.h"
#include "../thirdparty/json.hpp"

#ifndef func_H
#define func_H

using namespace std;

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

    return SmOperation(rpc_address, sm_address, jsonStr);

}

void storeSmartContracInfo(std::string network){

    string jsonSrt = "{\"option\": \"SmartContracInfo\"}";
    string rpc_address = Networks[network].rpc_address;
    string sm_address = Networks[network].sm_address;

    try {

        string tokenInfo =  SmOperation(rpc_address, sm_address, jsonSrt);

        if(tokenInfo == "py error catched" || !checkJson(tokenInfo)){
            return;
        }

        storeSmartContracInfoDB(network, json::parse(tokenInfo));

    } catch(const std::invalid_argument& e) {

    }

}

#endif