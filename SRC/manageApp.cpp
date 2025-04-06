#include "manage_app/http_server.h"

// g++ SRC/manageApp.cpp -o manageApp -lpthread -DCROW_ENABLE_SSL -lssl -lcrypto -lcryptopp -std=c++17

int main(){
    Py_Initialize();
    signal(SIGINT, signalHandler);
    http_server();
    return 0;
}
