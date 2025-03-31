#ifndef CODEC_H
#define CODEC_H

#include <string>
#include <iostream>
#include <iomanip>
#include <vector>

using namespace std;


uint8_t hexToUint8_t(const std::string hex) {
    if (hex.length() != 2) {
        std::cerr << "Error: the hex-string provided length != 2 " <<hex.length()<<endl;
        return 0;
    }

    std::istringstream iss(hex);
    uint16_t result;
    iss >> std::hex >> result;

    if (iss.fail()) {
        std::cerr << "Error: the hex-string provided length != 2" << std::endl;
        return 0;
    }

    return result;
}

string ullToHex(unsigned long long ullValue){
    stringstream ss;
    ss << hex << uppercase << setw(16) << setfill('0') << ullValue;
    return ss.str();
}

string intToHex(uint Value){
    stringstream ss;
    ss << hex << uppercase << setw(8) << setfill('0') << Value;
    return ss.str();
}

string intTobytecharhex(uint Value){
    stringstream ss;
    ss << hex << uppercase << setw(4) << setfill('0') << Value;
    return ss.str();
}

string  unsignedCharToHex(uint Value){
    stringstream ss;
    ss << hex << uppercase << setw(2) << setfill('0') << Value;
    return ss.str();
}

bool isHexDigit(char c){
    return ((c >= '0' && c <= '9') ||(c >= 'A' && c <= 'F')||(c >= 'a' && c <= 'f'));
}

std::string byteToHex(unsigned char byteValue){
    stringstream ss;
    ss << hex << setw(2) << setfill('0') << (int)byteValue;
    return ss.str();
}

std::string bytesToHexStr(const vector<uint8_t>& bytes){
    stringstream ss;
    ss << hex << setw(2) << setfill('0') ;
    for(const auto& byte : bytes) {
        ss<<setw(2)<<static_cast<int>(byte);
    }
    string str= ss.str();
    for (auto &c : str){c = toupper(c);}
    return str;
}

std::string byteToHex2(unsigned char byteValue){
    stringstream ss;
    ss << hex << setw(2) << setfill('0') << (int)byteValue;
    string str= ss.str();
    for (auto &c : str){c = toupper(c);}
    return str;
}

vector<uint8_t> HexStrToBytes(const std::string& str){
    vector<uint8_t>Data;
    for(uint i = 0; i<str.length();i+=2){
        Data.push_back(hexToUint8_t(str.substr(i,2)));
    }
    return Data;
}

string byteVectorToHexStr(const vector<unsigned char>& bytes){

    string str="";

    for(uint i =0; i<bytes.size();i++){
        str+=byteToHex2(bytes[i]);
    }

    return str;
}

unsigned long long hexToULL(std::string c){
    // Verificar que el string solo contenga caracteres hexadecimales
    for (unsigned int i = 0; i < c.length(); i++) {
        if (!isHexDigit(c[i])) {
            
            cerr << "El string contiene caracteres no hexadecimales" << endl;
            cout<<endl<<"error "<<c<<endl;
            return 0;
        }
    }
    stringstream ss;
    ss << hex << c;
    unsigned long long ullValue;
    ss >> ullValue;
    return ullValue;
}

unsigned char hexToUnsignedChar(string c){
        // Verificar que el string solo contenga caracteres hexadecimales
    for (unsigned int i = 0; i < c.length(); i++) {
        if (!isHexDigit(c[i])) {
            cerr << "El string contiene caracteres no hexadecimales" << endl;
            return 1;
        }
    }
    stringstream ss;
    ss << hex << c;
    unsigned char intValue;
    ss >> intValue;
    return intValue;

}

int hexToInt(std::string c){
    // Verificar que el string solo contenga caracteres hexadecimales
    for (unsigned int i = 0; i < c.length(); i++) {
        if (!isHexDigit(c[i])) {
            cerr << "El string contiene caracteres no hexadecimales" << endl;
            return 1;
        }
    }
    stringstream ss;
    ss << hex << c;
    int intValue;
    ss >> intValue;
    return intValue;
}

bool HexCheck(std::string c){
    // Verificar que el string solo contenga caracteres hexadecimales
    for (unsigned int i = 0; i < c.length(); i++) {
        if (!isHexDigit(c[i])) {
            cerr << "Error encoding or DB issue" << endl;
            return false;
        }
    }
return true;
}

void addHexStringInVector(vector<unsigned char> &vec, string datatocodify){
    for (unsigned int i = 0; i < datatocodify.length(); i += 2){
        vec.push_back(hexToInt(datatocodify.substr(i, 2)));
    }
}

#endif