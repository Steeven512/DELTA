#include "../libs/pythonw3.h"
#include "../thirdparty/json.hpp"

using namespace std;

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