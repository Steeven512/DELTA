#ifndef IO_H
#define IO_H

#include <iostream>
#include <fstream> // Add this line
#include <vector>
#include <string>

bool saveFile(std::string patch, std::vector<unsigned char> &Data){

    std::ofstream filew(patch , std::ios::binary | std::ios::out);
    if (!filew) { return "error de escritura"; }
    
    for (unsigned int i = 0; i < Data.size(); i++){
        filew.seekp(i);
        filew.put(Data[i]);
    }
    filew.close();

    return true;
}    


std::vector<unsigned char> readFile(const std::string& filename) {

    std::ifstream file(filename, std::ios::binary | std::ios::ate);
            std::vector<unsigned char> FileRead;

    try {

        if (!file.is_open()) {
            throw std::runtime_error("Could not open file "+filename);    
        }

    } catch (const std::exception& e) {
    
        file.close();
        std::cerr << "Error: " << e.what() << std::endl;
        std::vector<unsigned char> FileRead;
        return FileRead;
    }

    std::streamsize size = file.tellg();
    file.seekg(0, std::ios::beg);
    std::vector<uint8_t> buffer(size);

    if (!file.read(reinterpret_cast<char*>(buffer.data()), size)) {
        file.close();
        throw std::runtime_error("No se pudo leer el archivo");
    }

    file.close();
    return buffer;
}

time_t timing(){
    return time(nullptr);
}

#endif