#include "../thirdparty/crow_all.h"
#include "../thirdparty/json.hpp"
#include "../libs/DB.h"
#include "../libs/codec.h"
#include <string>
#include "func.h"

using namespace std;
uint port = 12015;

int http_server(){

    crow::SimpleApp server;

    CROW_ROUTE(server, "/CryptoAdmin")([](const crow::request &req){ 

        auto page = crow::mustache::load("CryptoAdmin.html");
        crow::mustache::context ctx;
        ctx["AccAdmin"] ="0x56237900a95ab58e4c75ff37357b7e507db43501f395534b263eb9e8bef6e0f1";
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

    CROW_ROUTE(server, "/AddressIndexing/<string>")([](const crow::request &req,  string Path){ 

        auto page = crow::mustache::load("AddressIndexing.html");
        crow::mustache::context ctx;
        ctx["Address"] = Path;
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
        const string from = x["from"].s();
        const string to = x["to"].s();
        const string network = x["network"].s();
        const string indexType = x["indexType"].s();
        const bool filterTransactions = x["filterTransactions"].b();
        const bool filterBalances = x["filterBalances"].b();
        const bool filterApproval = x["filterApproval"].b();
        const bool filterSupply = x["filterSupply"].b();
        const bool filterFreezeAddress = x["filterFreezeAddress"].b();
        const bool filterPause = x["filterPause"].b();
        const uint64_t From = hexToULL(from);
        uint64_t To1;
        crow::json::wvalue response;
        
        if(to == "last" ){
            To1 = hexToULL(readlatestBlockNumberIndexed(network));
        } else{
            if(to.length()!=16 && !HexCheck(to)){
                return crow::response(response); 
            }
            To1 = hexToULL(to);
        }

        const uint64_t To = To1;
        nlohmann::json fl;
        
        if(indexType == "general"){

            const string Path = "DB/EthEvents/";
            fl = indexEvents(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);

        } else if( indexType.length() != 42 || !HexCheck(indexType.substr( 2 , indexType.length()-2)) ) {

            return crow::response(response); 

        } else {
            const string Path = "DB/AccountIndex/"+indexType+"/";
            fl = indexEvents(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);
        }

        vector<string>jsonString;
        for (nlohmann::json transaction : fl) { 
            jsonString.push_back(transaction.dump());
            cout<<endl<<"debug json event "<<transaction.dump();

        }
        response = jsonString;
        return crow::response(response); 

    });

    CROW_ROUTE(server, "/api").methods("POST"_method)([](const crow::request &req){

        auto x = crow::json::load(req.body);
        const string request = x["request"].s();
  
        if(request == " AddressBalance "){

            string network = x["request"].s();
            const string address = x["last"].s();

            AddressBalance(network,address);

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

        if(request == "savedNetworks"){

            crow::json::wvalue response;
            response = savedNetworks();
            return crow::response(response); 

        }

        return crow::response("response"); 

    });


    
    auto _a = server.port(port)/*.ssl_file("ssl/domain.crt", "ssl/domain.key").*/.concurrency(128).run_async();

    return 0;

}