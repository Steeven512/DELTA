#include "libs/codec.h"
#include "libs/DB.h"
#include "libs/pythonw3.h"
#include "thirdparty/json.hpp"
#include "eth_event_listener/setting.h"
#include <thread>
#include <csignal>
<<<<<<< HEAD
=======
#include "libs/func.h"
>>>>>>> ac220ad (update progress, The checklist file describes the work)

//  g++ SRC/ethEventsListener.cpp -o eventslistener -I/usr/include/python3.11 -lboost_python311 -lpython3.11  -lssl -lcrypto -lcryptopp -std=c++17

using namespace std;
using json = nlohmann::json;

void signalHandler(int signum) {
    std::cout << "exit call (" << signum << ") .\n";
    exit(signum);
}

void  main_thread(){

    signal(SIGINT, signalHandler);

    vector<string> Result;
<<<<<<< HEAD
    uint64_t intervalIndex = 5;
=======
    uint64_t intervalIndex = 200;
>>>>>>> ac220ad (update progress, The checklist file describes the work)
    
    while(true){ 

        loadnetworks();
<<<<<<< HEAD

        for (const auto& network : Networks) {

            cout<<endl<<"indexing events on "<<network.first;

            Result.clear();

            if(network.second.LatestNetworkBl >= network.second.LatestIndexedbl){

=======
        
        for (const auto& network : Networks) {
            storeSmartContracInfo(network.first);
            cout<<endl<<"indexing events on "<<network.first;

            Result.clear();

            if(network.second.LatestNetworkBl >= network.second.LatestIndexedbl){

>>>>>>> ac220ad (update progress, The checklist file describes the work)
                uint64_t to;

                if (network.second.LatestNetworkBl - network.second.LatestIndexedbl < intervalIndex ){
                    if (network.second.LatestNetworkBl - network.second.LatestIndexedbl > network.second.LatestIndexedbl ){
                        cout<<"error network.second.LatestNetworkBl - network.second.LatestIndexedbl > network.second.LatestIndexedbl  "<<endl;
                        continue;
                    }
                    to = network.second.LatestNetworkBl;
                } else {
                    to = network.second.LatestIndexedbl+intervalIndex;
                }

                try{

<<<<<<< HEAD
                    vector result = EthEvents(network.second.rpc_address, network.second.sm_address, network.second.LatestIndexedbl, to);

                    for(uint i = 0; i < result.size(); i++){

                        json jsonResult = json::parse(result[i]);

                        auto it = jsonResult.find("event");

                        std::string event = jsonResult["event"];

                        cout<<endl<<"event =  " << event;

                        if (event != "emty"){

=======
                    storeSmartContracInfo(network.first);

                    vector result = EthEvents(network.second.rpc_address, network.second.sm_address, network.second.LatestIndexedbl, to);

                    for(uint i = 0; i < result.size(); i++){

                        json jsonResult = json::parse(result[i]);

                        auto it = jsonResult.find("event");

                        std::string event = jsonResult["event"];

                        cout<<endl<<"event =  " << event;

                        for(auto & eventElement : jsonResult){
                            cout<<endl<<"debug event "<<eventElement<<endl;
                        }

                        if (event != "emty"){

>>>>>>> ac220ad (update progress, The checklist file describes the work)
                            if(!saveEvent(network.first, jsonResult) || !SaveEventAddress(network.first, jsonResult)){

                                
                                cout <<"error saving local data "<< network.first << endl;
                                return ;

                            }

<<<<<<< HEAD

                            if (event == "accountBalanceUpdate"){

=======
                            if (event == "accountBalanceUpdate"){

>>>>>>> ac220ad (update progress, The checklist file describes the work)
                                if(!updateAccBalances(network.first, jsonResult)){

                                    cout <<"error saving local data "<<endl;
                                    return ;

                                }
                            }
                        }

                        if(i == result.size() -1){
                            Networks[network.first].LatestIndexedbl=++to;
                            SaveLatestIndexedBl(network.first, ullToHex(network.second.LatestIndexedbl));
                    
                        }
                    }
                } catch(const std::exception& e) {
                    std::cerr << "Error: " << e.what() << std::endl;
                }
            }

            Networks[network.first].LatestNetworkBl = LatestNetworkBlockNumber(network.second.rpc_address);
            cout<<" network.second.LatestIndexedbl "<<network.second.LatestIndexedbl-1<< " network.second.LatestNetworkBl "<<network.second.LatestNetworkBl<<endl;

        }

        /*
        if(network.second.LatestIndexedbl ==  network.second.LatestNetworkBl+1 || network.second.LatestNetworkBl == 0){

        }
        */
        std::this_thread::sleep_for(std::chrono::seconds(3));

    }

}

int main(int argc, char* argv[]){

    if(argc>1){
        string option = argv[1];
        if(SetOptions(option, argc, argv)){
            cout<<"set option successfully"<<endl;
        } else{
            cout<<"error setting parameter"<<endl;
        }
        return 0;
    }

    loadPathNetworkSets();

    loadnetworks();

    for (const auto& network : Networks) {
        Networks[network.first].LatestIndexedbl = hexToULL(readlatestBlockNumberIndexed(network.first));
        cout<<endl<<"latest indexed eth block number in "+network.first+" : "<<network.second.LatestIndexedbl<<endl;
    }

    thread thread1(main_thread);
    thread1.join();

    return 0;

}