#include "../libs/io.h"
#include "../libs/DB.h"
#include "../libs/hasher.h"
#include <termios.h>


bool SetOptions(string &option, int argc, char* argv[]){


    if(option == "setEthIndexBlFrom"){
        string network = argv[2];
        string EthBlNumber = argv[2];

        if(HexCheck(EthBlNumber)){
            cout<<endl<<"Data Format is invalid";
            return false;
        }

        return SaveLatestIndexedBl( network, ullToHex(stoull(EthBlNumber)));
    }

    return false;
}