#include "../thirdparty/crow_all.h"
#include "../thirdparty/json.hpp"
#include "../libs/DB.h"
#include "../libs/codec.h"
#include "../libs/func.h"
#include <string>


using namespace std;
uint port = 12015;

int http_server(){


    crow::SimpleApp server;

    CROW_ROUTE(server, "/CryptoAdmin")([](const crow::request &req){ 

        auto page = crow::mustache::load("CryptoAdmin.html");
        crow::mustache::context ctx;
        ctx["AccAdmin"] ="0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        ctx["NameCoin"] ="Regulated Stable Coin";
        ctx["symbol"] ="RSC";
        ctx["TotalSupply"] = "25600000000000";
        return page.render(ctx);

    });

    CROW_ROUTE(server, "/setting")([](const crow::request &req){ 

        auto page = crow::mustache::load("setting.html");
        crow::mustache::context ctx;
        ctx["AccAdmin"] ="0x56237900a95ab58e4c75ff37357b7e507db43501f395534b263eb9e8bef6e0f1";
        return page.render(ctx);

    });

    CROW_ROUTE(server, "/transfer")([](const crow::request &req){ 

        auto page = crow::mustache::load("transfer.html");
        crow::mustache::context ctx;
        ctx["AccAdmin"] ="";
        return page.render(ctx);

    });

    CROW_ROUTE(server, "/test_transfer").methods("POST"_method)([](const crow::request &req){


        auto x = crow::json::load(req.body);
        const string request = x["request"].s();
  
        if(request == "getPublic"){

            string privKey = x["pk"].s();
            
            return crow::response(DerivePublicKey(privKey));

        }

        if(request == "estimateGas"){

            string jsonValues = x["values"].s();
            string status = AdminSM(jsonValues);
            return crow::response(status); 

        }

        if(request == "transfer"){

            string jsonValues = x["values"].s();
            string status = AdminSM(jsonValues);
            return crow::response(status); 

        }

        if(request == "keyStorage"){

            string jsonValues = x["values"].s();
            string status;
            if(storageKey(jsonValues)){
                status = "success";
            } else {
                status ="fail";
            }

            return crow::response(status); 

        }

        if(request == "addressStorage"){

            string jsonValues = x["values"].s();

            string status;
            if(storageAddress(jsonValues)){
                status = "success";
            } else {
                status ="fail";
            }
            return crow::response(status); 

        }

        if(request == "deleteKey"){

            string address = x["address"].s();
            string status;
            if(eraseKey(address)){
                status = "success";
            } else {
                status ="fail";
            }
            return crow::response(status); 

        }

        if(request == "deleteAddress"){

            string address = x["address"].s();
            string status;
            if(eraseAddress(address)){
                status = "success";
            } else {
                status ="fail";
            }
            return crow::response(status); 

        }

        if(request == "walletsStored"){

            vector<json> wallets= walletsStored();
            
            cout<<endl<<"wallets.size "<<wallets.size(); 
            vector<string>jsonString;
            for (nlohmann::json wallet : wallets) { 

                jsonString.push_back(wallet.dump());
            }

            crow::json::wvalue response;

            response = jsonString;

            return crow::response(response); 

        }

        if(request == "addressesStored"){

            vector<json> wallets= AddressesStored();
            vector<string>jsonString;
            for (nlohmann::json wallet : wallets) { 

                jsonString.push_back(wallet.dump());
            }

            crow::json::wvalue response;
            response = jsonString;
            return crow::response(response); 

        }


        return crow::response("bad_req"); 

    });

    CROW_ROUTE(server, "/AddressIndexing/<string>")([](const crow::request &req,  string Address){ 

        auto page = crow::mustache::load("AddressIndexing.html");
        crow::mustache::context ctx;
        ctx["Address"] = Address;
        return page.render(ctx);

    });

    CROW_ROUTE(server, "/css/<string>")([](const crow::request& req, crow::response& res, string Path) {

        if(!noConsecutivePeriods(Path)){
            cout<<endl<<"secucheck .. "<<endl;
            res.code = 404;
            res.end();
        }

        std::ifstream file;

        file.open("templates/" + Path, std::ios::binary);

        if (file) {
            std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
            res.write(content);
            res.end();
        } else {
            res.code = 404;
            res.end();
        }
        
    });

    CROW_ROUTE(server, "/js/<string>")([](const crow::request& req, crow::response& res, string Path) {

        if(!noConsecutivePeriods(Path)){
            cout<<endl<<"secucheck .. "<<endl;
            res.code = 404;
            res.end();
        }



        std::ifstream file;

        file.open("templates/" + Path, std::ios::binary);

        if (file) {
            res.add_header("Content-Type", "application/javascript");
            std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
            res.write(content);
            res.end();
        } else {
            res.code = 404;
            res.end();
        }
        
    });

    CROW_ROUTE(server, "/IndexEvents").methods("POST"_method)([](const crow::request &req){

        auto x = crow::json::load(req.body);

        cout<<"IndexEvents debug req.body "<<req.body<<endl;


        const string from = x["from"].s();
        const string to = x["to"].s();
        const string network = x["network"].s();
        const string indexType = x["indexType"].s();
        const bool filterTransactions = x["filterTransactions"].b();
        const bool filterBalances = false;
        const bool filterApproval = x["filterApproval"].b();
        const bool filterSupply = x["filterSupply"].b();
        const bool filterFreezeAddress = x["filterFreezeAddress"].b();
        const bool filterPause = x["filterPause"].b();
        const bool filterBridgeDebug = true ;


        const uint64_t From = hexToULL(from);

        uint64_t To1;
        crow::json::wvalue response;

        if(!isNetworkExist(network)){
            return crow::response(response);
        }
        
        if(to == "last" ){
            To1 = readLatestBlDbIndexed(network);
        } else{
            if(to.length()!=16 && !HexCheck(to)){
                return crow::response(response); 
            }
            To1 = hexToULL(to);
        }

        const uint64_t To = To1;
        nlohmann::json fl;

        cout<<endl<<"indexType "<<indexType<<endl;

        if(indexType == "new"){

            const string Path = "DB/"+network+"/EthEvents/";

            fl = retrieveTabQueryByNumber(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause, filterBridgeDebug);
            vector<string>jsonString;
            jsonString.push_back(ullToHex(countPackagesEventsIntervals(Path, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause, filterBridgeDebug)));
            for (nlohmann::json transaction : fl) { 

                jsonString.push_back(transaction.dump());
            }
            response = jsonString;
            return crow::response(response); 

        }

        vector<string>jsonString;
        
        if(indexType == "general"){

            const string Path = "DB/"+network+"/EthEvents/";
            fl = indexEvents(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause, filterBridgeDebug);

        } else if( indexType.length() != 42 || !HexCheck(indexType.substr( 2 , indexType.length()-2)) ) {

            return crow::response(response); 

        } else {
            const string Path = "DB/"+network+"/AccountIndex/"+indexType+"/";
            jsonString.push_back(ullToHex(countPackagesEventsIntervals(Path, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause, filterBridgeDebug)));
            fl = retrieveTabQueryByNumber(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause,filterBridgeDebug);
        }


        for (nlohmann::json transaction : fl) { 

            jsonString.push_back(transaction.dump());
        }
        response = jsonString;
        return crow::response(response); 

    });

    CROW_ROUTE(server, "/api").methods("POST"_method)([](const crow::request &req){
		

        auto x = crow::json::load(req.body);
        const string request = x["request"].s();
  
        if(request == "AddressBalance"){

            string network = x["network"].s();
            const string address = x["address"].s();

            return crow::response(to_string(AddressBalance(network,address)));

        }

        if(request == "networkSet"){

            const string networkSetting = x["networksetting"].s();

            json jsonSet = json::parse(networkSetting);

            if(saveNetwork(jsonSet)){
                return crow::response("success"); 
            } else {
                return crow::response("fail"); 
            }

        }
        
        if(request == "eraseNetwork"){
            const string networkSetting = x["networkName"].s();
            if(eraseFile("sets/networks/"+networkSetting)){
                return crow::response("success"); 
            } else {
                return crow::response("fail"); 
            }
        }

        if(request == "SaveLatestIndexedBl"){

            const string networkSetting = x["networksetting"].s();

            string numberbl = x["numberBl"].s();

            if(SaveLatestIndexedBl(networkSetting, ullToHex(hexToULL(numberbl)))){
                return crow::response("success"); 
            } else {
                return crow::response("fail"); 
            }

        }

        if(request == "savedNetworks"){

            crow::json::wvalue response;
            response = savedNetworks();
            return crow::response(response); 

        }

        if(request == "AdminSM"){

            string jsonValues = x["values"].s();
            string status = AdminSM(jsonValues);

            return crow::response(status); 

        }

        if(request == "CryptoInfo"){

            string network = x["network"].s();

            if(!isNetworkExist(network)){
                
                return crow::response("network not found");
            }

            json TokenInfo = ReadSmartContracInfoDB(network);
            TokenInfo["networkName"] = network;
            TokenInfo["networkid"] = Networks[network].networkid;
            TokenInfo["sm_address"] = Networks[network].sm_address;
            TokenInfo["lastBlIndexed"] = readLatestBlDbIndexed(network);
 
            return crow::response(TokenInfo.dump()); 

        }

        if(request == "ChartInfo"){

            string network = x["network"].s();

            if(!isNetworkExist(network)){
                
                return crow::response("network not found");
            }

            string typeindexTime = x["typeindexTime"].s();
            string TypeOfElement = x["TypeOfElement"].s();
            string from = x["Fromdate"].s();
            string to = x["to"].s();

            uint64_t From = hexToULL(from);
            uint64_t To = hexToULL(to);

            crow::json::wvalue response;

            if(TypeOfElement == "MintedBurned"){

                vector<uint64_t> minted = eventsPointInTimeLine(network,From,To,"MintVolume",typeindexTime);
                vector<uint64_t> burned = eventsPointInTimeLine(network,From,To,"burnVolume",typeindexTime);

                response[0] = minted;
                response[1] = burned;

            } else if(TypeOfElement == "TransfersValueVolume" || TypeOfElement == "amountTransfers"|| TypeOfElement == "MintedBurned"){ 

                response = eventsPointInTimeLine(network,From,To,TypeOfElement,typeindexTime);

            }

            return crow::response(response); 

        }

        if(request == "getBalanceW3"){

            string result = AdminSM(x["values"].s());

            return crow::response(result);

        }


        return crow::response("response"); 

    });


    
    auto _a = server.port(port)/*.ssl_file("ssl/domain.crt", "ssl/domain.key").*/.concurrency(128).run_async();

    return 0;

}
