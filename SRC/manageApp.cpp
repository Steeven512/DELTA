#include "manage_app/http_server.h"

// g++ SRC/manageApp.cpp -o BIN/manageApp -lpthread -std=c++17 -I/usr/include/python3.11 -lboost_python311 -lpython3.11

int main(){
    Py_Initialize();
    signal(SIGINT, signalHandler);
    http_server();
    return 0;
}
