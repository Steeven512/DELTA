#include <filesystem>
#include <fstream>
#include <vector>
#include <string>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <regex>
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
    uint requestInterval;
    uint64_t LatestIndexedbl;
    uint64_t LatestNetworkBl;
    
};

inline std::unordered_map<string, struct network>Networks;

json ReadEvent(string Path){

    std::ifstream jsonFileEvent(Path);
    if (jsonFileEvent.is_open()) {
        json EventData;
        jsonFileEvent >> EventData;
        jsonFileEvent.close();
        return EventData;
    } else {
        std::cerr << "directory does not exist  " << Path << std::endl;
        return  {{"value", "emty"}}; 
    }

}

bool eraseFile(string Path){

    if (Path.empty()) {
        std::cerr << "Error: Path cannot be empty." << std::endl;
        return false;
    }

    if (std::filesystem::exists(Path)) {
        try {
            return std::filesystem::remove(Path);
        } catch (const std::filesystem::filesystem_error& e) {
            std::cerr << "Error deleting file '" << Path << "': " << e.what() << std::endl;
            return false;
        }
    } else {
        std::cerr << "Warning: File '" << Path << "' does not exist." << std::endl;
        return true; 
    }

}

json ReadDataChart(string network , string blockTimestamp, string typeindexTime, string TypeOfElement){

    return ReadEvent("DB/"+network+"/Chart/"+typeindexTime+"/"+blockTimestamp+"/"+TypeOfElement);

}

bool SaveData(string Path, json Data){

    std::ofstream archivo(Path);
    if (archivo.is_open()){
        archivo << Data.dump(4); 
        archivo.close();
        std::cout << Path+" saved succesfully." << std::endl;
        return true;
    } else {
        std::cerr << "Error storing "+Path << std::endl;
    }
    return false;

}

bool mkDir(std::string Path){

    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
            return true;
        } else {
            std::cerr << "error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    return false;

}

bool checkFileExist(string Path){

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

time_t getHour0day(time_t timedata){

    return timedata - (timedata % 86400);

}

std::time_t getStartOfCurrentHour(time_t timedata) {

    std::tm* utcTime = std::gmtime(&timedata);
    if (utcTime != nullptr) {
        return timedata - (timedata % 3600);
    } else {
        return -1;
    }

}

void loadnetworks(){

    for ( const auto& File : fs::directory_iterator("sets/networks/") ) {

        json networkset = ReadNetworkFileSet(File.path().string());
        Networks[File.path().filename().string()].networkName = networkset["networkName"];
        Networks[File.path().filename().string()].rpc_address = networkset["rpc_address"];
        Networks[File.path().filename().string()].sm_address = networkset["sm_address"];
        Networks[File.path().filename().string()].networkid = networkset["networkid"];

        Networks[File.path().filename().string()].requestInterval = stoi(networkset["requestInterval"].get<std::string>());

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

    cout<<endl<<" SaveLatestIndexedBl at "<<Network<< endl;

    mkDir("DB/"+Network+"/");

    std::ofstream filedata("DB/"+Network+"/"+"latestEthBlockNumber", ios::binary | ios::out);
    if (!filedata) {return false;}
    for (unsigned int i = 0; i < byteArray.size(); i++){
        filedata.seekp(i);
        filedata.put(byteArray[i]);
    }
    filedata.close();

    if(readlatestBlockNumberIndexed(Network) != Data ){
        cout<<endl<<"SaveLatestIndexedBl error = SaveLatestIndexedEthBlIndex() readlatestEthBlockNumber() != Data "<<endl;
        return false;
    }
    return true;
}

uint64_t readLatestBlDbIndexed(std::string Network){

    json latestEvent = ReadEvent("DB/"+Network+"/LatestDbElement");

    if(latestEvent["value"]=="emty"){
        return 0;
    }

    if (latestEvent.contains("blockNumber")) {
        return latestEvent["blockNumber"];
    }

    return 0;

}

bool SaveLatestBlDbIndexed(std::string Network, json event){

    uint64_t LatestBlDbIndexed = readLatestBlDbIndexed( Network);

    if(LatestBlDbIndexed < event["blockNumber"]){

        std::ofstream archivo("DB/"+Network+"/LatestDbElement");
        if (archivo.is_open()){
            archivo << event.dump(4); 
            archivo.close();
            std::cout << "LatestDbElement saved succesfully." << std::endl;
            return true;
        } else {
            std::cerr << "SaveLatestBlDbIndexed Error storing LatestDbElement." << std::endl;
        }
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
            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
        }
    }
    Path += "/"+Network;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
        }
    }
    Path += "/AccountIndex/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
        }
    }
    Path += Address;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
        }
    }
    Path += "/"+bldir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {

            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
        }
    }
    Path += "/"+transactiondir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
        }
    }
    Path += "/"+logIndexdir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "pathOfAddressEvent error mkdir " + Path  << std::endl;
            return "pathOfAddressEvent /error/"; 
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
            std::cerr << "SaveTimeStampIndexEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += "/"+Network;

    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "SaveTimeStampIndexEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    Path += "/EthEvents/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "SaveTimeStampIndexEvent error mkdir " + Path  << std::endl;
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
        std::cerr << "SaveTimeStampIndexEvent Error storing event file." << std::endl;
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
            std::cerr << "saveEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += "/"+Network;

    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "saveEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    Path += "/EthEvents/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "saveEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += bldir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {

            std::cerr << "saveEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }


    Path += "/"+transactiondir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "saveEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }
    Path += "/"+logIndexdir;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "saveEvent error mkdir " + Path  << std::endl;
            return false; 
        }
    }

    std::ofstream archivo(Path+"/"+event);

    if (archivo.is_open()) {
    archivo << ethEvent.dump(4); 
    archivo.close();
    std::cout << "EventStored." << std::endl;

    } else {
        std::cerr << "saveEvent Error storing event file." << std::endl;
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
            std::cerr << "updateAccBalances error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    Path += "/"+Network;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "updateAccBalances error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    Path += "/AccountIndex/";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "updateAccBalances error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    Path += Account;
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "updateAccBalances error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }

    Path += "/balances";
    if ( access(Path.c_str() , 0) != 0) {
        if (mkdir(Path.c_str(), 0777) == 0) {
        } else {
            std::cerr << "updateAccBalances error mkdir " + Path  << std::endl;
            return false; // Salir con error
        }
    }
    
    std::vector<unsigned char> value;
    addHexStringInVector(value,Balances);
    return saveFile( Path+"/Balances"  ,   value);
    

}

vector<uint16_t> getDirOfTransactionsEvents(const std::string &Path, const std::string &BlNumber, const std::string &TrNumber ){

    std::string EthEventsdir = Path+BlNumber+"/"+TrNumber; 
    std::vector<uint16_t> BlocksNumberIndex;

    if (!fs::exists(EthEventsdir) || !fs::is_directory(EthEventsdir)) {
        std::cerr << "getDirOfTransactionsEvents Error, no such directory "+Path+BlNumber+"/"+TrNumber<< std::endl;
        return BlocksNumberIndex;
    }

    for (const auto& entry : fs::directory_iterator(EthEventsdir)) {
        if (fs::is_directory(entry.status())) {
            try {
                BlocksNumberIndex.push_back(hexToULL(entry.path().filename().string()));
            } catch (const std::invalid_argument& e) {

            }
        }
    }

    std::sort(BlocksNumberIndex.begin(), BlocksNumberIndex.end(), std::greater<uint64_t>());

    return BlocksNumberIndex;

}

vector<uint32_t> getDirOfBlTransactions(const std::string &Path, const std::string &BlNumber){

    std::string EthEventsdir = Path+BlNumber; 
    std::vector<uint32_t> BlocksNumberIndex;

    if (!fs::exists(EthEventsdir) || !fs::is_directory(EthEventsdir)) {
        std::cerr << "getDirOfBlTransactions Error, no such directory "+ Path+"/"+ BlNumber << std::endl;
        return BlocksNumberIndex;
    }

    for (const auto& entry : fs::directory_iterator(EthEventsdir)) {
        if (fs::is_directory(entry.status())) {
            try {
                BlocksNumberIndex.push_back(hexToULL(entry.path().filename().string()));
            } catch (const std::invalid_argument& e) {
            }
        }
    }

    std::sort(BlocksNumberIndex.begin(), BlocksNumberIndex.end(), std::greater<uint32_t>());

    return BlocksNumberIndex;
  
}

vector<uint64_t> getDirOfBlocksInRange(const std::string &Path, const uint64_t &from, const uint64_t &to){

    std::vector<uint64_t> BlocksNumberIndex;

    if (!fs::exists(Path) || !fs::is_directory(Path)) {
        std::cerr << "getDirOfBlocksInRange Error, no such directory DB/EthEvents/" << std::endl;
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

    return BlocksNumberIndex;

}

vector<json> indexEventsChart(const std::string Path,string block , const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo ){

    vector<json> EthEvents;

        vector<uint32_t> transactionNumberIndex = getDirOfBlTransactions(Path, block);

        for (const auto &transaction : transactionNumberIndex) {

            vector<uint16_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, block, ullToHex(transaction));

            for (auto &Event : EventsTransactionNumberIndex) {

                bool checkEntry=false;

                for (const auto& File : fs::directory_iterator(Path+block+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {
                   if(checkEntry){
                        cout<<endl<<"indexEvents error, there is more than one file in the directory"<<endl;
                        break;
                    }
                    if( 
                        (File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                        (File.path().filename().string() == "Transfer" && filterTransactions) || 
                        (File.path().filename().string() == "Approval" && filterApproval) || 
                        ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                        ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                        ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause) ||
                        (File.path().filename().string() == "BridgeTo" && filterBridgeTo) 
                    ) {

                        EthEvents.push_back(ReadEvent(File.path().string()));
                    }

                    checkEntry = true;
                }
            }
        }

    return EthEvents;

}

vector<json> indexEvents(const std::string Path, const uint64_t &from, const uint64_t &to, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo ){

    vector<uint64_t> BlocksNumberIndex = getDirOfBlocksInRange(Path, from, to);
    vector<json> EthEvents;

    for (const auto &Block : BlocksNumberIndex) {

        vector<uint32_t> transactionNumberIndex = getDirOfBlTransactions(Path, ullToHex(Block));

        for (const auto &transaction : transactionNumberIndex) {

            vector<uint16_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, ullToHex(Block), ullToHex(transaction));

            for (auto &Event : EventsTransactionNumberIndex) {

                bool checkEntry=false;

                for (const auto& File : fs::directory_iterator(Path+ullToHex(Block)+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {
                   if(checkEntry){
                        cout<<endl<<"indexEvents error, there is more than one file in the directory"<<endl;
                        break;
                    }
                    if( 
                        (File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                        (File.path().filename().string() == "Transfer" && filterTransactions) || 
                        (File.path().filename().string() == "Approval" && filterApproval) || 
                        ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                        ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                        ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause) ||
                        (File.path().filename().string() == "BridgeTo" && filterBridgeTo) 
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

bool loadPathNetworkSets(){

    if(!mkDir("DB")){
        return false;
    }
    std::string Path = "sets";
    if(!mkDir("sets")){ 
        cout<<endl<<"fl1";
        return false;
    }
    Path += "/networks";
    if(!mkDir(Path)){
                cout<<endl<<"fl2";
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
        std::cerr << "saveNetwork Error storing network set." << std::endl;
        return false; 
    }

    return true;

}

vector<json> loadnetworksJson(){

    vector<json>networks;

    for ( const auto& File : fs::directory_iterator("sets/networks/") ) {
        json networkset = ReadNetworkFileSet(File.path().string());
        networkset["startIndexingFrom"] = readlatestBlockNumberIndexed(File.path().filename().string());
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

    mkDir("DB/"+network+"/");

    std::ofstream archivo("DB/"+network+"/tokenInfo");
    if (archivo.is_open()) {
        archivo << tokenInfo.dump(4); 
        archivo.close();
    } else {
        std::cerr << "storeSmartContracInfoDB Error storing event file." << std::endl;
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
        std::cerr << "ReadSmartContracInfoDB Error reading network setting file  " << "DB/"+network+"/tokenInfo" << std::endl;
        return 1; 
    }

}

uint64_t readTimeStampOfBlock(string network, string blockNumber){

    json timestamp = ReadEvent("DB/"+network+"/EthEvents/"+blockNumber+"/timestamp");
    return timestamp["timestamp"];

}

uint64_t countPackagesEventsIntervals(string network ,const std::string Path, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo){

    uint64_t EthEventsCounter=0;
    
    std::vector<std::string> hexDirectories;
    std::regex hexRegex("^[0-9a-fA-F]+$");

    json networkset = ReadNetworkFileSet("sets/networks/"+network);
    string startIndexingFrom= networkset["startIndexingFrom"];
    uint64_t lastDbElement = readLatestBlDbIndexed(network);
    uint64_t lastTimestamp = readTimeStampOfBlock(network, ullToHex(lastDbElement));
    uint64_t beginningbl = stoull(startIndexingFrom);
    string dirName;

    for(lastDbElement; lastDbElement >=beginningbl; lastDbElement--){

        dirName = ullToHex (lastDbElement);

        if( !checkFileExist("DB/"+network+"/EthEvents/"+dirName+"/timestamp") ){
            continue;
        }

            vector<uint32_t> transactionNumberIndex = getDirOfBlTransactions(Path, dirName);

            for (auto &transaction : transactionNumberIndex) {

                vector<uint16_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, dirName, ullToHex(transaction));

                for (auto & Event : EventsTransactionNumberIndex) {

                    bool checkEntry=false;

                    for (const auto& File : fs::directory_iterator(Path+dirName+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {

                    if(checkEntry){
                            break;
                        }

                        if( 
                            (File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                            (File.path().filename().string() == "Transfer" && filterTransactions) || 
                            (File.path().filename().string() == "Approval" && filterApproval) || 
                            ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                            ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                            ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause) ||
                            (File.path().filename().string() == "BridgeTo" && filterBridgeTo) || 
                            ((File.path().filename().string() == "BridgeIn") || (File.path().filename().string() == "BridgeStored") || (File.path().filename().string() == "BridgeDeleted") && filterPause) 
                        ) {

                            EthEventsCounter++;
                        }
                        checkEntry = true;
                    }
                }
            }
        
    }
    return EthEventsCounter;
}

uint64_t countPackagesEventsIntervalsAddress(const std::string Path, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo){


    std::vector<std::string> hexDirectories;
    std::regex hexRegex("^[0-9a-fA-F]+$");
    uint64_t EthEventsCounter=0;

    for (const auto& entry : fs::directory_iterator(Path)) {
        if (fs::is_directory(entry.status())) {
            std::string filename = entry.path().filename().string();
            if (std::regex_match(filename, hexRegex)) {
                hexDirectories.push_back(filename);
            }
        }
    }
    std::sort(hexDirectories.begin(), hexDirectories.end(), [](const std::string& a, const std::string& b) {
        long long intA = hexToULL(a);
        long long intB = hexToULL(b);
        return intA > intB;
    });

    for(const auto& dirName : hexDirectories){
{
            vector<uint32_t> transactionNumberIndex = getDirOfBlTransactions(Path, dirName);
            for (auto &transaction : transactionNumberIndex) {

                vector<uint16_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, dirName, ullToHex(transaction));

                for (auto & Event : EventsTransactionNumberIndex) {

                    bool checkEntry=false;

                    for (const auto& File : fs::directory_iterator(Path+dirName+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {

                    if(checkEntry){
                            break;
                        }

                        if( 
                            (File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                            (File.path().filename().string() == "Transfer" && filterTransactions) || 
                            (File.path().filename().string() == "Approval" && filterApproval) || 
                            ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                            ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                            ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause) ||
                            (File.path().filename().string() == "BridgeTo" && filterBridgeTo) || 
                            ((File.path().filename().string() == "BridgeIn") || (File.path().filename().string() == "BridgeStored") || (File.path().filename().string() == "BridgeDeleted") && filterPause) 
                        ) {

                            EthEventsCounter++;
                        }
                        checkEntry = true;
                    }
                }
            }
        }
    }
    return EthEventsCounter;
}

vector<json> indexEventsByIntervals(string network, const std::string Path, const uint64_t &startIndexFrom, const uint64_t &qttyElements, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo ){

    uint64_t ElementCount=0;
    uint16_t qttyElementsCount=0;
    vector<json> EthEvents;


    json networkset = ReadNetworkFileSet("sets/networks/"+network);
    string startIndexingFrom= networkset["startIndexingFrom"];
    uint64_t lastDbElement = readLatestBlDbIndexed(network);
    uint64_t lastTimestamp = readTimeStampOfBlock(network, ullToHex(lastDbElement));
    uint64_t beginningbl = stoull(startIndexingFrom);
    string dirName;

    for(lastDbElement; lastDbElement >=beginningbl; lastDbElement--){


        dirName = ullToHex (lastDbElement);

        if( !checkFileExist("DB/"+network+"/EthEvents/"+dirName+"/timestamp") ){
            continue;
        }

        vector<uint32_t> transactionNumberIndex = getDirOfBlTransactions(Path, dirName);

        for (const auto &transaction : transactionNumberIndex) {

            vector<uint16_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, dirName, ullToHex(transaction));

            for (const auto &Event : EventsTransactionNumberIndex) {

                bool checkEntry=false;

                for (const auto& File : fs::directory_iterator(Path+dirName+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {

                    if(checkEntry){
                        cout<<endl<<"indexEvents error, there is more than one file in the directory"<<endl;
                        break;
                    }

                    if( 
                        ( File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                        ( File.path().filename().string() == "Transfer" && filterTransactions) || 
                        ( File.path().filename().string() == "Approval" && filterApproval) || 
                        ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                        ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                        ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause) ||
                        ( File.path().filename().string() == "BridgeTo" && filterBridgeTo) || 
                        ((File.path().filename().string() == "BridgeIn") || (File.path().filename().string() == "BridgeStored") || (File.path().filename().string() == "BridgeDeleted") && filterPause) 
                    ) {
                        ElementCount++;
                        if(ElementCount>=startIndexFrom ){
                            EthEvents.push_back(ReadEvent(File.path().string()));
                            qttyElementsCount++;
                        }
                        if(qttyElementsCount>=qttyElements){
                            return EthEvents;
                        }
                    }
                    checkEntry = true;
                }
            }
        }
    }
    return EthEvents;
}

vector<json> indexEventsByIntervalsAddress(const std::string Path, const uint64_t &startIndexFrom, const uint64_t &qttyElements, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo ){

    uint64_t ElementCount=0;
    uint16_t qttyElementsCount=0;

    std::vector<std::string> hexDirectories;
    std::regex hexRegex("^[0-9a-fA-F]+$");
    vector<json> EthEvents;

    for (const auto& entry : fs::directory_iterator(Path)) {
        if (fs::is_directory(entry.status())) {
            std::string filename = entry.path().filename().string();
            if (std::regex_match(filename, hexRegex)) {
                hexDirectories.push_back(filename);
            }
        }
    }
    std::sort(hexDirectories.begin(), hexDirectories.end(), [](const std::string& a, const std::string& b) {
        long long intA = hexToULL(a);
        long long intB = hexToULL(b);
        return intA > intB;
    });

    for(const auto &dirName : hexDirectories){

        vector<uint32_t> transactionNumberIndex = getDirOfBlTransactions(Path, dirName);

        for (const auto &transaction : transactionNumberIndex) {

            vector<uint16_t> EventsTransactionNumberIndex = getDirOfTransactionsEvents(Path, dirName, ullToHex(transaction));

            for (const auto &Event : EventsTransactionNumberIndex) {

                bool checkEntry=false;

                for (const auto& File : fs::directory_iterator(Path+dirName+"/"+ullToHex(transaction)+"/"+ullToHex(Event))) {

                    if(checkEntry){
                        cout<<endl<<"indexEvents error, there is more than one file in the directory"<<endl;
                        break;
                    }

                    if( 
                        ( File.path().filename().string() == "accountBalanceUpdate" && filterBalances) ||
                        ( File.path().filename().string() == "Transfer" && filterTransactions) || 
                        ( File.path().filename().string() == "Approval" && filterApproval) || 
                        ((File.path().filename().string() == "SupplyDecreased" || File.path().filename().string() == "SupplyIncreased") && filterSupply) ||
                        ((File.path().filename().string() == "FrozenAddressWiped" || File.path().filename().string() == "FreezeAddress"|| File.path().filename().string() == "UnfreezeAddress") && filterFreezeAddress)||
                        ((File.path().filename().string() == "Pause" || File.path().filename().string() == "Unpause") && filterPause) ||
                        ( File.path().filename().string() == "BridgeTo" && filterBridgeTo) || 
                        ((File.path().filename().string() == "BridgeIn") || (File.path().filename().string() == "BridgeStored") || (File.path().filename().string() == "BridgeDeleted") && filterPause) 
                    ) {
                        ElementCount++;
                        if(ElementCount>=startIndexFrom ){
                            EthEvents.push_back(ReadEvent(File.path().string()));
                            qttyElementsCount++;
                        }
                        if(qttyElementsCount>=qttyElements){
                            return EthEvents;
                        }
                    }
                    checkEntry = true;
                }
            }
        }
    }
    return EthEvents;
}

vector<json>retrieveTabQueryByNumber(string network, const std::string Path, uint64_t Frame_tab, uint32_t selecctor, const bool &filterTransactions, const bool &filterBalances, const bool &filterApproval, const bool &filterSupply, const bool &filterFreezeAddress, const bool &filterPause, const bool &filterBridgeTo ){

    const uint64_t selectTab = Frame_tab*selecctor;
    return indexEventsByIntervals(network, Path, selectTab, Frame_tab, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause, filterBridgeTo);

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



bool storeDataChart(string network, uint64_t timeSums, string TypeOfElement, string intervaltime, time_t blockTimestamp){

    json DataChart = {{"TypeOfElement", TypeOfElement} , {"value", timeSums} , {"timestamp" , blockTimestamp} }; 

    mkDir("DB/"+network+"/Chart");
    mkDir("DB/"+network+"/Chart/"+intervaltime);
    mkDir("DB/"+network+"/Chart/"+intervaltime+"/"+to_string(blockTimestamp));

    return SaveData("DB/"+network+"/Chart/"+intervaltime+"/"+to_string(blockTimestamp)+"/"+TypeOfElement, DataChart);

}

vector<uint64_t> SumEventsElementOnTime(string network, vector<json> events, time_t lastDate, uint64_t PeriodTime, uint16_t splitIntervals, string TypeOfElement, string typeindexTime){

    vector<uint64_t>timeSums;
    uint64_t splitedIntervals = PeriodTime / splitIntervals;

    for(uint i = 0 ; i < splitIntervals ; i++){

        timeSums.push_back(0);

        std::time_t intervaltime;

        intervaltime = lastDate-splitedIntervals;
 
        for(uint e = 0 ; e < events.size(); e++){
            if(events[e]["timestamp"] >= intervaltime && events[e]["timestamp"] < intervaltime + splitedIntervals ){
                if( events[e]["TypeOfElement"] ==  TypeOfElement ){
                    timeSums[i] = events[e]["value"];
                    break;
                } else {
                    timeSums[i]++;
                }

            }
        }

        json cacheChart = ReadDataChart(network , to_string(intervaltime+1), typeindexTime, TypeOfElement);

        if(cacheChart["value"]=="emty"){
			if(readTimeStampOfBlock(network , ullToHex(readLatestBlDbIndexed(network))) >  splitedIntervals + intervaltime){
				storeDataChart(network, timeSums[i], TypeOfElement, typeindexTime, intervaltime+1);
			}
        }
        
        lastDate = intervaltime;
    }
    return timeSums;
}

vector<uint64_t> EventsElementOnTime(string network, vector<json> events, time_t lastDate, uint64_t PeriodTime, uint16_t splitIntervals, string TypeOfElement, string typeindexTime){

    vector<uint64_t>timeSums;
    uint64_t splitedIntervals = PeriodTime / splitIntervals;

    for(uint i = 0 ; i < splitIntervals ; i++){

        timeSums.push_back(0);

        std::time_t intervaltime;

        intervaltime = lastDate-splitedIntervals;
        
        for(uint e = 0 ; e < events.size(); e++){

            if(events[e]["timestamp"] >= intervaltime && events[e]["timestamp"] < intervaltime + splitedIntervals ){
                uint64_t sum =  events[e][elementForIndexSum(TypeOfElement)];
                timeSums[i]+= sum;
            }
        }

            json cacheChart = ReadDataChart(network , to_string(intervaltime+1), typeindexTime, TypeOfElement);

            if(cacheChart["value"]=="emty"){
				if(readTimeStampOfBlock(network , ullToHex(readLatestBlDbIndexed(network))) >  splitedIntervals + intervaltime){
					
					storeDataChart(network, timeSums[i], TypeOfElement, typeindexTime, intervaltime+1);
					
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

vector<json> readEventsTimestampEvent(string network, uint64_t last, uint64_t old, uint splitTime, string TypeOfElement, string typeindexTime){

    vector<json> eventsFiltered;
    vector<json> events;
    time_t blockTimestamp;
    bool filterTransfer;
    bool filterBalances;
    bool filterApproval;
    bool filterSupply;
    bool filterFreezeAddress;
    bool filterPause;
    bool filterBridgeOut;
    string filterElement;

    json networkset = ReadNetworkFileSet("sets/networks/"+network);
    string startIndexingFrom= networkset["startIndexingFrom"];

    uint64_t beginningbl = stoull(startIndexingFrom);

    SetFilterElements(TypeOfElement, filterElement, filterTransfer, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);

    time_t timeStampsDiscard = 99999999999999;


    uint64_t lastDbElement = readLatestBlDbIndexed(network);
    uint64_t lastTimestamp = readTimeStampOfBlock(network, ullToHex(lastDbElement));


    bool check = false;

    string dirName;

    for(lastDbElement; lastDbElement >=beginningbl; lastDbElement--){

        dirName = ullToHex (lastDbElement);

        if( !checkFileExist("DB/"+network+"/EthEvents/"+dirName+"/timestamp") ){
            continue;
        }


        blockTimestamp = readTimeStampOfBlock(network, dirName);

        if(typeindexTime == "day"){

            if( (blockTimestamp <= lastTimestamp  ||  blockTimestamp < timeStampsDiscard ) || check){

                json cacheChart = ReadDataChart(network , to_string(getHour0day(lastTimestamp)), typeindexTime, TypeOfElement);

                lastTimestamp = getHour0day(lastTimestamp)-1;

                if(cacheChart["value"]!="emty"){

                    if(cacheChart["TypeOfElement"] == TypeOfElement){

                        eventsFiltered.push_back(cacheChart); 
                        last = lastTimestamp;
                        check =  true;
            
                    }
                } else {
                    check=false;
                    timeStampsDiscard = getHour0day(blockTimestamp);
                }
            }
        }

        if(typeindexTime == "hour"){


            if( (blockTimestamp <= lastTimestamp  ||  blockTimestamp < timeStampsDiscard ) || check){

                json cacheChart = ReadDataChart(network , to_string(getStartOfCurrentHour(lastTimestamp)), typeindexTime, TypeOfElement);

                lastTimestamp = getStartOfCurrentHour(lastTimestamp)-1;

                if(cacheChart["value"]!="emty"){
                    if(cacheChart["TypeOfElement"] == TypeOfElement){
                        eventsFiltered.push_back(cacheChart); 
                        last = lastTimestamp;
                        check =  true;

                    }
                } else {
                    check=false;
                    timeStampsDiscard = getStartOfCurrentHour(blockTimestamp);
                }
            }
        }


        if( old > blockTimestamp || old >= last ){
            break;
        }
        if( blockTimestamp >  last){
            continue;
        }

        uint64_t blockNumber = hexToULL(dirName);

        events.clear();

        events = indexEventsChart("DB/"+network+"/EthEvents/", dirName, filterTransfer, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause, filterBridgeOut);

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

        typeindexTime = "day";

        uint PeriodTime = 604800;
        uint16_t splitIntervals = 7;
        uint splitTime = 604800/7;

        vector<json> events = readEventsTimestampEvent( network, last, last-PeriodTime, splitTime,TypeOfElement, typeindexTime);

        if(TypeOfElement == "amountTransfers"){

            xyElements = SumEventsElementOnTime(network, events, last, PeriodTime, splitIntervals, TypeOfElement, typeindexTime);

        }  else {

            xyElements = EventsElementOnTime(network, events, last, PeriodTime, splitIntervals, TypeOfElement, typeindexTime);

        }

        return xyElements ;

    }

    if(typeindexTime == "day"){

        typeindexTime = "hour";
        uint PeriodTime = 86400;
        uint16_t splitIntervals = 24;
        uint splitTime = PeriodTime/splitIntervals;

        vector<json> events = readEventsTimestampEvent( network, last, last-PeriodTime, splitTime,TypeOfElement, typeindexTime);

        if(TypeOfElement == "amountTransfers"){

            xyElements = SumEventsElementOnTime(network, events, last, PeriodTime, splitIntervals, TypeOfElement, typeindexTime);

        }  else {

            xyElements = EventsElementOnTime(network, events, last, PeriodTime, splitIntervals, TypeOfElement, typeindexTime);

        }

    }

    return xyElements;
    
}

vector<json> walletsStored(){

    vector<json>Wallets;
    std::string Path = "wallets/keys/"; 

    if (!fs::exists(Path) || !fs::is_directory(Path)) {
        std::cerr << "no such directory "+ Path << std::endl;
        return Wallets;
    }

    for (const auto& entry : fs::directory_iterator(Path)) {

            try {
                Wallets.push_back(ReadEvent(Path+entry.path().filename().string()));
            } catch (const std::invalid_argument& e) {
				
            }
    }

    return Wallets;

}

vector<json> AddressesStored(){

    vector<json>Addresses;
    std::string Path = "wallets/addresses/"; 

    if (!fs::exists(Path) || !fs::is_directory(Path)) {
        std::cerr << " no such directory "+ Path << std::endl;
        return Addresses;
    }

    for (const auto& entry : fs::directory_iterator(Path)) {

		try {
			Addresses.push_back(ReadEvent(Path+entry.path().filename().string()));
		} catch (const std::invalid_argument& e) {
		}

    }

    return Addresses;

}




#endif
