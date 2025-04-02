#include "../thirdparty/crow_all.h"
#include "../thirdparty/json.hpp"
#include "../libs/DB.h"
#include "../libs/codec.h"
<<<<<<< HEAD
=======
#include "../libs/func.h"
>>>>>>> ac220ad (update progress, The checklist file describes the work)
#include <string>


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

<<<<<<< HEAD

    CROW_ROUTE(server, "/setting")([](const crow::request &req){ 

=======
    CROW_ROUTE(server, "/setting")([](const crow::request &req){ 

>>>>>>> ac220ad (update progress, The checklist file describes the work)
        auto page = crow::mustache::load("setting.html");
        crow::mustache::context ctx;
        ctx["AccAdmin"] ="0x56237900a95ab58e4c75ff37357b7e507db43501f395534b263eb9e8bef6e0f1";
        return page.render(ctx);

    });

<<<<<<< HEAD
    CROW_ROUTE(server, "/AddressIndexing/<string>")([](const crow::request &req,  string Path){ 

        auto page = crow::mustache::load("AddressIndexing.html");
        crow::mustache::context ctx;
        ctx["Address"] = Path;
=======
    CROW_ROUTE(server, "/AddressIndexing/<string>")([](const crow::request &req,  string Address){ 

        auto page = crow::mustache::load("AddressIndexing.html");
        crow::mustache::context ctx;
        ctx["Address"] = Address;
>>>>>>> ac220ad (update progress, The checklist file describes the work)
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
<<<<<<< HEAD
        const uint64_t From = hexToULL(from);
        uint64_t To1;
        crow::json::wvalue response;
=======
        const uint64_t From = stoull(from);
        uint64_t To1;
        crow::json::wvalue response;

        if(!isNetworkExist(network)){
            return crow::response(response);
        }
>>>>>>> ac220ad (update progress, The checklist file describes the work)
        
        if(to == "last" ){
            To1 = hexToULL(readlatestBlockNumberIndexed(network));
        } else{
            if(to.length()!=16 && !HexCheck(to)){
                return crow::response(response); 
            }
<<<<<<< HEAD
            To1 = hexToULL(to);
=======
            To1 = stoull(to);
>>>>>>> ac220ad (update progress, The checklist file describes the work)
        }

        const uint64_t To = To1;
        nlohmann::json fl;
        
        if(indexType == "general"){

<<<<<<< HEAD
            const string Path = "DB/EthEvents/";
=======
            cout<<endl<<"debugg entrye server"<<endl;

            const string Path = "DB/"+network+"/EthEvents/";
>>>>>>> ac220ad (update progress, The checklist file describes the work)
            fl = indexEvents(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);

        } else if( indexType.length() != 42 || !HexCheck(indexType.substr( 2 , indexType.length()-2)) ) {

            return crow::response(response); 

        } else {
<<<<<<< HEAD
            const string Path = "DB/AccountIndex/"+indexType+"/";
=======
            const string Path = "DB/"+network+"/AccountIndex/"+indexType+"/";
>>>>>>> ac220ad (update progress, The checklist file describes the work)
            fl = indexEvents(Path, From , To, filterTransactions, filterBalances, filterApproval, filterSupply, filterFreezeAddress, filterPause);
        }

        vector<string>jsonString;
        for (nlohmann::json transaction : fl) { 
            jsonString.push_back(transaction.dump());
<<<<<<< HEAD
            cout<<endl<<"debug json event "<<transaction.dump();

=======
>>>>>>> ac220ad (update progress, The checklist file describes the work)
        }
        response = jsonString;
        return crow::response(response); 

    });

    CROW_ROUTE(server, "/api").methods("POST"_method)([](const crow::request &req){

<<<<<<< HEAD
        auto x = crow::json::load(req.body);
        const string request = x["request"].s();
  
        if(request == " AddressBalance "){

            string network = x["request"].s();
            const string address = x["last"].s();

            AddressBalance(network,address);
=======

        auto x = crow::json::load(req.body);
        const string request = x["request"].s();
  
        if(request == "AddressBalance"){

            string network = x["network"].s();
            const string address = x["address"].s();

            return crow::response(to_string(AddressBalance(network,address)));
>>>>>>> ac220ad (update progress, The checklist file describes the work)

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

<<<<<<< HEAD
=======
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
 
            return crow::response(TokenInfo.dump()); 

        }

>>>>>>> ac220ad (update progress, The checklist file describes the work)
        return crow::response("response"); 

    });


    
    auto _a = server.port(port)/*.ssl_file("ssl/domain.crt", "ssl/domain.key").*/.concurrency(128).run_async();

    return 0;

}