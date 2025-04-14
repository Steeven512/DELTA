#include "libs/codec.h"
#include "libs/DB.h"
#include "libs/pythonw3.h"
#include "thirdparty/json.hpp"
#include "eth_event_listener/setting.h"
#include <thread>
#include <csignal>
#include "libs/func.h"

//  g++ SRC/ethEventsListener.cpp -o eventslistener -I/usr/include/python3.11 -lboost_python311 -lpython3.11  -lssl -lcrypto -lcryptopp -std=c++17

using namespace std;
using json = nlohmann::json;



void  main_thread(){

    signal(SIGINT, signalHandler);

    Py_Initialize();

    loadnetworks();

    for (const auto& network : Networks) {
        storeSmartContracInfo(network.first);
    }

    vector<string> Result;

    while(true){ 

        loadnetworks();

        vector<bool>SyncedToLastCheck;
        
        for (const auto& network : Networks) {
            
            cout<<endl<<"indexing events on "<<network.first;

            Result.clear();

            if(network.second.LatestNetworkBl >= network.second.LatestIndexedbl){

                uint64_t to;

                if (network.second.LatestNetworkBl - network.second.LatestIndexedbl < network.second.requestInterval ){
                    if (network.second.LatestNetworkBl - network.second.LatestIndexedbl > network.second.LatestIndexedbl ){
                        cout<<"error network.second.LatestNetworkBl - network.second.LatestIndexedbl > network.second.LatestIndexedbl  "<<endl;
                        continue;
                    }
                    to = network.second.LatestNetworkBl;
                } else {
                    to = network.second.LatestIndexedbl+network.second.requestInterval;
                }

                try{

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

                            if(!saveEvent(network.first, jsonResult) || !SaveEventAddress(network.first, jsonResult)|| !SaveTimeStampIndexEvent(network.first, jsonResult)){
                                cout <<"error saving local data "<< network.first << endl;
                                return ;
                            }

                            if (event == "accountBalanceUpdate"){
                                if(!updateAccBalances(network.first, jsonResult)){
                                    cout <<"error saving local data "<<endl;
                                    return ;
                                }
                            }

                            if(i == result.size() -1){
                                SaveLatestBlDbIndexed(network.first, jsonResult);
                            }
                        }

                        if(i == result.size() -1){
                            Networks[network.first].LatestIndexedbl=to;
                            SaveLatestIndexedBl(network.first, ullToHex(network.second.LatestIndexedbl));
                        }
                    }

                } catch(const std::exception& e) {
                    std::cerr << "Error: " << e.what() << std::endl;
                }
            }

            Networks[network.first].LatestNetworkBl = LatestNetworkBlockNumber(network.second.rpc_address);
            cout<<" network.second.LatestIndexedbl "<<network.second.LatestIndexedbl-1<< " network.second.LatestNetworkBl "<<network.second.LatestNetworkBl<<endl;

            if(network.second.LatestIndexedbl ==  network.second.LatestNetworkBl || network.second.LatestNetworkBl == 0){
                SyncedToLastCheck.push_back(true);
            }else{
                SyncedToLastCheck.push_back(false);
            }

        }

        for(uint i =0 ; i<SyncedToLastCheck.size(); i++){
			std::this_thread::sleep_for(std::chrono::milliseconds(200));
            if(!SyncedToLastCheck[i]){
                break;
            }
            if(i == SyncedToLastCheck.size()-1){
                std::this_thread::sleep_for(std::chrono::seconds(6));
            }
        }


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
