#include <filesystem>
#include <fstream>
#include <vector>
#include <string>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include "../thirdparty/json.hpp"
#include "io.h"
#include "codec.h"

#ifndef DB_H
#define DB_H

using json = nlohmann::json;
namespace fs = std::filesystem;

inline uint64_t LatestIndexedEthbl;

struct network{

    string networkName;
    string rpc_address;
    string sm_address;
    string networkid;
    uint64_t LatestIndexedbl;
    uint64_t LatestNetworkBl;
    
};

inline std::unordered_map<string, struct network>Networks;

bool checkFileExist (string Path){

    std::ifstream file(Path);
    if (file.is_open()) {
        return true;
    } else {
        return false; 
    }
    return false;

}

json ReadNetworkFileSet(std::string FilePath){

    std::ifstream jsonFileEvent(FilePath);
    if (jsonFileEvent.is_open()) {
        json EventData;
        jsonFileEvent >> EventData;
        jsonFileEvent.close();
        return EventData;
    } else {
        std::cerr << "Error reading network setting file  " << FilePath << std::endl;
        return 1; 
    }

}

void loadnetworks(){

    for ( const auto& File : fs::directory_iterator("sets/networks/") ) {

        json networkset = ReadNetworkFileSet(File.path().string());

        Networks[File.path().filename().string()].networkName = networkset["networkName"];
        Networks[File.path().filename().string()].rpc_address = networkset["rpc_address"];
        Networks[File.path().filename().string()].sm_address = networkset["sm_address"];
        Networks[File.path().filename().string()].networkid = networkset["networkid"];

    }

    return;

}

bool isNetworkExist(std::string Network){

    loadnetworks();

    for(auto &network: Networks){

        if(network.first == Network){
            return true;
        }
    }

    return false;
    
}

std::string readlatestBlockNumberIndexed(std::string Network){

    std::ifstream fileData("DB/"+Network+"/latestEthBlockNumber", std::ios::binary | std::ios::ate);
    std::string pr;

    std::vector<unsigned char> bl2;
    
    if (!fileData.is_open()) {
        return ullToHex(LatestIndexedEthbl);
        throw std::runtime_error("cannot open DB/latestEthBlockNumber");

    }

    std::streamsize size = fileData.tellg();
    fileData.seekg(0, std::ios::beg);
    std::vector<unsigned char> buffer(size);
    
    if (!fileData.read(reinterpret_cast<char*>(buffer.data()), size)) {
        throw std::runtime_error("error reading file DB/latestEthBlockNumber");
    }

    bl2.clear();
    bl2 = buffer;
    fileData.close();
    std::string bl = bytesToHexStr(bl2);
    if(bl.length() != 16 && HexCheck(bl) ){
        std::cout<<std::endl<<"error - readlatestEthBlockNumber() bl.length() != 16 && HexCheck(bl) "<<std::endl;
        return "error - Error reading db readlatestEthBlockNumber ";
    }
    
    return bl;
}

bool SaveLatestIndexedBl(std::string Network, std::string Data){

    if(Data.length() != 16 ){
        std::cout<<endl<<"error = SaveLatestIndexedEthBlIndex() Data.length() != 16 "<<std::endl;
        return false;
    }

    std::vector<unsigned char> byteArray;
    addHexStringInVector(byteArray, Data);

    std::ofstream filedata("DB/"+Network+"/"+"latestEthBlockNumber", ios::binary | ios::out);
    if (!filedata) {return false;}
    for (unsigned int i = 0; i < byteArray.size(); i++){
        filedata.seekp(i);
        filedata.put(byteArray[i]);
    }
    filedata.close();

    if(readlatestBlockNumberIndexed(Network) != Data ){
        cout<<endl<<"error = SaveLatestIndexedEthBlIndex() readlatestEthBlockNumber() != Data "<<endl;
        return false;
    }
    return true;
}

bool GetAddressOfEvent(json &ethEvent, string &AddressA, string& AddressB){

    if(ethEvent["event"] == "accountBalanceUpdate"){

        AddressA = ethEvent["Account"];

    } else if(ethEvent["event"] == "Transfer"){

        AddressA = ethEvent["from"];
        AddressB = ethEvent["to"];

    } else if(ethEvent["event"] == "Approval"){

        AddressA = ethEvent["owner"];
        AddressB = ethEvent["spender"];

    } else if(ethEvent["event"] == "FrozenAddressWiped"){

        AddressA = ethEvent["addr"];

    } else if(ethEvent["event"] == "FreezeAddress"){

        AddressA = ethEvent["addr"];

    } else if(ethEvent["event"] == "UnfreezeAddress"){

        AddressA = ethEvent["addr"];

    } else if(ethEvent["event"] == "SupplyDecreased"){

        AddressA = ethEvent["from"];

    } else if(ethEvent["event"] == "SupplyIncreased"){

        AddressA = ethEvent["to"];

    }

    return true;

}

std::string pathOfAddressEvent(std::string &Network, json &ethEvent, std::string &Address){

    std::string bldir = ullToHex(ethEvent["blockNumber"]);
    std::string transactiondir = ullToHex(ethEvent["transactionIndex"]);
    std::string logIndexdir = ullToHex(ethEvent["logIndex"]);

    std::string Path = "DB";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return "/error/"; 
        }
    }
    Path += "/"+Network;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return "/error/"; 
        }
    }
    Path += "/AccountIndex/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return "/error/"; 
        }
    }
    Path += Address;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return "/error/";
        }
    }
    Path += "/"+bldir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {

            std::cerr << "error mkdir " + Path  << std::endl;
            return "/error/";
        }
    }
    Path += "/"+transactiondir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir" + Path  << std::endl;
            return "/error/";
        }
    }
    Path += "/"+logIndexdir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir" + Path  << std::endl;
            return "/error/";
        }
    }

    return Path;

}

bool SaveEventAddress(std::string Network, json &ethEvent){

    std::string event = ethEvent["event"];

    if (event != "accountBalanceUpdate" &&
        event != "Transfer" &&
        event != "Approval" &&
        event != "FrozenAddressWiped" &&
        event != "FreezeAddress" &&
        event != "UnfreezeAddress" &&
        event != "SupplyDecreased" &&
        event != "SupplyIncreased"){

        return true;
    }

    std::string bldir = ullToHex(ethEvent["blockNumber"]);
    std::string transactiondir = ullToHex(ethEvent["transactionIndex"]);
    std::string logIndexdir = ullToHex(ethEvent["logIndex"]);
    std::string Path;
    std::string addressA;
    std::string addressB;

    if(!GetAddressOfEvent(ethEvent, addressA, addressB)){
        return false;
    }


    if(addressA.substr(2 , addressA.length()-2).length() != 40 ){
        return false;
    }

    Path = pathOfAddressEvent(Network, ethEvent, addressA);

    std::ofstream File(Path+"/"+event);

    if (File.is_open()) {
    File << ethEvent.dump(4);
    File.close();
    std::cout << "Address Event writed in DB succesfully ." << std::endl;

    } else {
        std::cerr << "Error writing address event in DB " << std::endl;
        return false; 
    }

    if (event != "Transfer" && event != "Approval" ){
        return true;
    }

    if(addressB.substr(2 , addressB.length()-2).length() != 40 ){
        return false;
    }

    Path = pathOfAddressEvent(Network, ethEvent, addressB);

    std::ofstream File2(Path+"/"+event);

    if (File2.is_open()) {
    File2 << ethEvent.dump(4);
    File2.close();
    std::cout << "Event Address writed in DB succesfully ." << std::endl;

    } else {
        std::cerr << "Error writing address event in DB " << std::endl;
        return false; 
    }

    return true;

}

bool SaveTimeStampIndexEvent(std::string Network, json &ethEvent){

    std::string bldir = ullToHex(ethEvent["blockNumber"]);

    std::string Path = "DB";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += "/"+Network;

    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    Path += "/EthEvents/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    Path += bldir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {

            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    std::ofstream archivo(Path+"/timestamp");

    if (archivo.is_open()) {
    archivo << ethEvent.dump(4); 
    archivo.close();
    std::cout << "EventStored." << std::endl;

    } else {
        std::cerr << "Error storing event file." << std::endl;
        return false; 
    }

    return true;

}

bool saveEvent(std::string Network, json &ethEvent){

    std::string bldir = ullToHex(ethEvent["blockNumber"]);
    std::string transactiondir = ullToHex(ethEvent["transactionIndex"]);
    std::string logIndexdir = ullToHex(ethEvent["logIndex"]);
    std::string event = ethEvent["event"];

    std::string Path = "DB";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += "/"+Network;

    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    Path += "/EthEvents/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += bldir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {

            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }


    Path += "/"+transactiondir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += "/"+logIndexdir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    std::ofstream archivo(Path+"/"+event);

    if (archivo.is_open()) {
    archivo << ethEvent.dump(4); 
    archivo.close();
    std::cout << "EventStored." << std::endl;

    } else {
        std::cerr << "Error storing event file." << std::endl;
        return false; 
    }

    return true;

}

bool updateAccBalances(std::string Network, json &ethEvent){

    std::string event = ethEvent["event"];
    std::string Account = ethEvent["Account"];
    std::string Balances = ullToHex(ethEvent["balances"]);


    std::string Path = "DB";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    Path += "/"+Network;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    Path += "/AccountIndex/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    Path += Account;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }

    Path += "/balances";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    
    std::vector<unsigned char> value;
    addHexStringInVector(value,Balances);
    return saveFile( Path+"/Balances"  ,   value);
    

}

json ReadEvent(string Path){

    std::ifstream jsonFileEvent(Path);
    if (jsonFileEvent.is_open()) {
        json EventData;
        jsonFileEvent >> EventData;
        jsonFileEvent.close();
        return EventData;
    } else {
        std::cerr << "Error opening event file  " << Path << std::endl;
        return 1; 
    }

}

vector<uint64_t> getDirOfTransactionsEvents(const std::string &Path, uint64_t &BlNumber, uint64_t &TrNumber ){

    std::string EthEventsdir = Path+ullToHex(BlNumber)+"/"+ullToHex(TrNumber); 
    std::vector<uint64_t> BlocksNumberIndex;

    if (!fs::exists(EthEventsdir) || !fs::is_directory(EthEventsdir)) {
        std::cerr << "Error, no such directory"+Path+ullToHex(BlNumber)+"/"+ullToHex(TrNumber) << std::endl;
        return BlocksNumberIndex;
    }

    for (const auto& entry : fs::directory_iterator(EthEventsdir)) {
        if (fs::is_directory(entry.status())) {
            try {
                uint64_t BlockNumberEvent = hexToULL(entry.path().filename().string());
                BlocksNumberIndex.push_back(BlockNumberEvent);
            } catch (const std::invalid_argument& e) {

            }
        }
    }

    std::sort(BlocksNumberIndex.begin(), BlocksNumberIndex.end(), std::greater<uint64_t>());

    /*(uint64_t dirNumber : BlocksNumberIndex) {
        std::cout << dirNumber << std::endl;
    }
    */
    return BlocksNumberIndex;

}

vector<uint64_t> getDirOfBlTransactions(const std::string &Path, const uint64_t &BlNumber){

    std::string EthEventsdir = Path+ullToHex(BlNumber); 
    std::vector<uint64_t> BlocksNumberIndex;

    if (!fs::exists(EthEventsdir) || !fs::is_directory(EthEventsdir)) {
        std::cerr << "Error, no such directory "+ Path+"/"+ ullToHex(BlNumber) << std::endl;
        return BlocksNumberIndex;
    }

    for (const auto& entry : fs::directory_iterator(EthEventsdir)) {
        if (fs::is_directory(entry.status())) {
            try {
                uint64_t BlockNumberEvent = hexToULL(entry.path().filename().string());
                BlocksNumberIndex.push_back(BlockNumberEvent);
            } catch (const std::invalid_argument& e) {
            }
        }
    }

    std::sort(BlocksNumberIndex.begin(), BlocksNumberIndex.end(), std::greater<uint64_t>());

    /*std::cout << "Directories order:" << std::endl;
    for (uint64_t dirNumber : BlocksNumberIndex) {
        std::cout << dirNumber << std::endl;
    }
    */
    return BlocksNumberIndex;
  
}

vector<uint64_t> getDirOfBlocksInRange(const std::string &Path, const uint64_t &from, const uint64_t &to){

    std::vector<uint64_t> BlocksNumberIndex;

    if (!fs::exists(Path) || !fs::is_directory(Path)) {
        std::cerr << "Error, no such directory DB/EthEvents/" << std::endl;
        return BlocksNumberIndex;
    }

    for (const auto& entry : fs::directory_iterator(Path)) {
        if (fs::is_directory(entry.status())) {
            try {

                uint64_t BlockNumberEvent = hexToULL(entry.path().filename().string());
                if(BlockNumberEvent >= from && BlockNumberEvent <= to ){
                    BlocksNumberIndex.push_back(BlockNumberEvent);
                }

            } catch (const std::invalid_argument& e) {
            }
        }
    }

    std::sort(BlocksNumberIndex.begin(), BlocksNumberIndex.end(), std::greater<uint64_t>());

    /*std::cout << "Directories order:" << std::endl;
    for (uint64_t dirNumber : BlocksNumberIndex) {
        std::cout << dirNumber << std::endl;
    }
    */

    return BlocksNumberIndex;

}

vector<json> indexEvents(const std::string Path, const uint64_t &from, const uint64_t &to, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause){


    cout<<endl<<"call debug indexEvents Path "<<Path<<endl;

    vector<uint64_t> BlocksNumberIndex = getDirOfBlocksInRange(Path, from, to);
    vector<json> EthEvents;

    for (uint64_t Block : BlocksNumberIndex) {

        vector<uint64_t> transactionNumberIndex = getDirOfBlTransactions(Path, Block);

        for (uint64_t transaction : transactionNumberIndex) {

            vector<uint64_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, Block, transaction);

            for (uint64_t Event : EventsTransactionNumberIndex) {

                bool checkEntry=false;

                for (const auto& File : fs::directory_iterator(Path+ullToHex(Block)+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {
                    if(checkEntry){
                        cout<<endl<<"error, there is more than one file in the directory"<<endl;
                        break;
                    }

                    if( (File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                        (File.path().filename().string() == "Transfer" && filterTransactions) || 
                        (File.path().filename().string() == "Approval" && filterApproval) || 
                        ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                        ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                        ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause)
                    ) {

                        EthEvents.push_back(ReadEvent(File.path().string()));
                    }

                    checkEntry = true;
                }
 
            }
        }
    }

    return EthEvents;

}

uint64_t AddressBalance(std::string &Network, string address){

    string Path = "DB/"+Network+"/AccountIndex/"+address+"/balances/Balances";
    std::vector<unsigned char> AddressFileBalance = readFile(Path) ;

    if(AddressFileBalance.size()==0){
        return 0;
    }

    std::string balanceRead =  byteVectorToHexStr(AddressFileBalance);
    return hexToULL(balanceRead);

}

bool mkDir(std::string Path){

    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    return true;

}

bool loadPathNetworkSets(){
    std::string Path = "sets";
    if(!mkDir(Path)){
        return false;
    }
    Path += "/networks";
    if(!mkDir(Path)){
        return false;
    }
    return true;
}

bool saveNetwork(json &networtSet){

    loadPathNetworkSets();

    std::string networkname = networtSet["networkName"];
    std::ofstream archivo("sets/networks/"+networkname);

    if (archivo.is_open()){

        archivo << networtSet.dump(4); 
        archivo.close();
        std::cout << "network saved succesfully." << std::endl;

    } else {
        std::cerr << "Error storing network set." << std::endl;
        return false; 
    }

    return true;

}

vector<json> loadnetworksJson(){

    vector<json>networks;

    for ( const auto& File : fs::directory_iterator("sets/networks/") ) {

        json networkset = ReadNetworkFileSet(File.path().string());
        networks.push_back(networkset);

    }

    return networks;

}

vector<string> savedNetworks(){

    vector<json>networksjson = loadnetworksJson();
    vector<string>vectorNetworks;

    for (const auto& network : networksjson) {
        vectorNetworks.push_back(network.dump());
    }

    return vectorNetworks;
    
}

bool storeSmartContracInfoDB(std::string network, json tokenInfo){

    std::ofstream archivo("DB/"+network+"/tokenInfo");
    if (archivo.is_open()) {
        archivo << tokenInfo.dump(4); 
        archivo.close();
    } else {
        std::cerr << "Error storing event file." << std::endl;
        return false; 
    }
    return true;
}

json ReadSmartContracInfoDB(std::string network){

    std::ifstream jsonFileEvent("DB/"+network+"/tokenInfo");

    if (jsonFileEvent.is_open()) {
        json EventData;
        jsonFileEvent >> EventData;
        jsonFileEvent.close();
        return EventData;
    } else {
        std::cerr << "Error reading network setting file  " << "DB/"+network+"/tokenInfo" << std::endl;
        return 1; 
    }

}

string elementForIndexSum(string TypeOfElement){

    if(TypeOfElement == "TransfersValueVolume"){
        return "value";
    }

    if(TypeOfElement == "MintVolume"){
        return "value";
    }

    if(TypeOfElement == "burnVolume"){
        return "value";
    }

    return "error elementForIndexSum";

}

uint64_t readTimeStampOfBlock(string network, uint64_t blockNumber){

    json timestamp = ReadEvent("DB/"+network+"/EthEvents/"+ullToHex(blockNumber)+"/timestamp");
    return timestamp["timestamp"];

}

vector<uint64_t> SumEventsElementOnTime(vector<json> events, uint64_t lastDate, uint64_t PeriodTime, uint16_t splitIntervals, string TypeOfElement){

    vector<uint64_t>timeSums;
    uint64_t splitedIntervals = PeriodTime / splitIntervals;

    for(uint i = 0 ; i < splitIntervals ; i++){

        timeSums.push_back(0);
        uint64_t intervaltime = lastDate-splitedIntervals;

        for(uint e = 0 ; e < events.size(); e++){
        
            if(events[e]["timestamp"] > intervaltime && events[e]["timestamp"] <= intervaltime + splitedIntervals ){

                timeSums[i]++;
            }

        }

        lastDate = intervaltime;

    }

    return timeSums;

}

vector<uint64_t> EventsElementOnTime(vector<json> events, uint64_t lastDate, uint64_t PeriodTime, uint16_t splitIntervals, string TypeOfElement){

    vector<uint64_t>timeSums;
    uint64_t splitedIntervals = PeriodTime / splitIntervals;

    for(uint i = 0 ; i < splitIntervals ; i++){

        timeSums.push_back(0);
        uint64_t intervaltime = lastDate-splitedIntervals;

        for(uint e = 0 ; e < events.size(); e++){
        
            if(events[e]["timestamp"] > intervaltime && events[e]["timestamp"] <= intervaltime + splitedIntervals ){
                uint64_t sum =  events[e][elementForIndexSum(TypeOfElement)];
                timeSums[i]+= sum;
            }

        }

        lastDate = intervaltime;

    }

    return timeSums;

}

void SetFilterElements(string TypeOfElement, string &filterElement,bool &filterTransactions,  bool &filterBalances,  bool &filterApproval,  bool &filterSupply,  bool &filterFreezeAddress,  bool &filterPause){

    if(TypeOfElement == "TransfersValueVolume" || TypeOfElement == "amountTransfers" ){

        filterTransactions = true;
        filterElement = "Transfer";

    }

    if(TypeOfElement == "MintVolume" ){

        filterSupply = true;
        filterElement = "SupplyIncreased";

    }

    if(TypeOfElement == "burnVolume" ){

        filterSupply = true;
        filterElement = "SupplyDecreased";

    }

}

vector<json> readEventsTimestampEvent(string network, uint64_t last, uint64_t old, string TypeOfElement){

    vector<json> eventsFiltered;
    vector<json> events;
    uint64_t blockTimestamp;

    bool filterTransactions;
    bool filterBalances;
    bool filterApproval;
    bool filterSupply;
    bool filterFreezeAddress;
    bool filterPause;
    string filterElement;

    SetFilterElements(TypeOfElement, filterElement, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);

    for(uint64_t blockNumber = hexToULL(readlatestBlockNumberIndexed(network)) ; blockNumber>0 ; blockNumber--){

        if( !checkFileExist("DB/"+network+"/EthEvents/"+ullToHex(blockNumber)+"/timestamp") ){
            continue;
        }

        blockTimestamp = readTimeStampOfBlock(network, blockNumber);

        if( blockTimestamp >  last){
            continue;
        }

        if( old > blockTimestamp ){
            break;
        }

        events.clear();
        events = indexEvents("DB/"+network+"/EthEvents/", blockNumber, blockNumber, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);

        cout<<endl<<" eventFilter "<< filterElement<<endl;

        for(auto& event: events){

            string eventstr = event["event"];

            if(eventstr == filterElement){
                eventsFiltered.push_back(event);
            }
        }
    }

    return eventsFiltered;

}


vector<uint64_t> eventsPointInTimeLine(string network, uint64_t last, uint64_t old, string TypeOfElement, string typeindexTime){

    vector<uint64_t > xyElements;

    if(typeindexTime == "week"){

        uint PeriodTime = 604800;
        uint16_t splitIntervals = 7;
        vector<json> events = readEventsTimestampEvent( network, last, last-PeriodTime, TypeOfElement);

        if(TypeOfElement == "amountTransfers"){

            xyElements = SumEventsElementOnTime(events, last, PeriodTime, splitIntervals, TypeOfElement);

        }  else {

            xyElements = EventsElementOnTime(events, last, PeriodTime, splitIntervals, TypeOfElement);

        }

    }

    return xyElements;
    
}




#endif