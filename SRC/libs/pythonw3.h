#include <iostream>
#include <boost/python.hpp>
#include <vector>
#include <mutex>

#ifndef PYTHONW3_H
#define PYTHONW3_H

using namespace std;

std::mutex mtx;

namespace py = boost::python;

namespace {
    bool python_initialized = false;
}

vector<string> convert_python_list_to_vector(boost::python::object py_list) {

        if (!python_initialized) {
        Py_Initialize();
        python_initialized = true;
        // Considerar PyEval_InitThreads() si usarás threads en Python
    }

    vector<string> result;
    boost::python::ssize_t length = boost::python::len(py_list);
  
    for (boost::python::ssize_t i = 0; i < length; ++i) {
        string element = boost::python::extract<string>(py_list[i]);
        result.push_back(element);
    }

    return result;
}

vector<string> EthEvents(string RPC_Network, string SM_address, uint64_t from, uint64_t To){

        if (!python_initialized) {
        Py_Initialize();
        python_initialized = true;
        // Considerar PyEval_InitThreads() si usarás threads en Python
    }

    std::vector<string> cpp_vector;

    try {

        py::object main_module = py::import("__main__");
        py::object main_namespace = main_module.attr("__dict__");
        py::object sys = py::import("sys");
        py::object sys_path = sys.attr("path");
        sys_path.attr("insert")(0, "");
        py::exec_file("PyScripts/EventRpcIndexer.py", main_namespace);
        py::object result = main_namespace["eventsIndexer"](RPC_Network, SM_address,from,To);

        cpp_vector = convert_python_list_to_vector(result);
        return cpp_vector;

    } catch (const py::error_already_set& e) {
            PyErr_Print();
            return cpp_vector;
    }

    return cpp_vector;
}

uint64_t LatestNetworkBlockNumber(string RPC_Network){

        if (!python_initialized) {
        Py_Initialize();
        python_initialized = true;
        // Considerar PyEval_InitThreads() si usarás threads en Python
        }

    uint64_t bl= 0;

    try {

        py::object main_module = py::import("__main__");
        py::object main_namespace = main_module.attr("__dict__");

        py::object sys = py::import("sys");
        py::object sys_path = sys.attr("path");
        sys_path.attr("insert")(0, "");
        py::exec_file("PyScripts/EventRpcIndexer.py", main_namespace);
        py::object result = main_namespace["latestEthBlockN"](RPC_Network);
        bl  = py::extract<uint64_t>(result);

        return bl;

    } catch (const py::error_already_set& e) {
            PyErr_Print();
            return bl;
    }

    return bl;

}


string SmOperation(string &RPC_Network, string &sm_address, string &jsonStr){

    cout<<endl<<"python initialized debug "<< python_initialized<<endl;

    if (!python_initialized) {

        Py_Initialize();
        python_initialized = true;

    }

    int counterfl = 0;

    try {

        std::unique_lock<std::mutex> lock(mtx);
        
        py::object main_module = py::import("__main__");
        py::object main_namespace = main_module.attr("__dict__");
        py::object sys = py::import("sys");       
        py::object sys_path = sys.attr("path");   
        sys_path.attr("insert")(0, "");
        py::exec_file("PyScripts/operateSM.py", main_namespace);
        py::object result = main_namespace["performTransactionSM"](RPC_Network, sm_address, jsonStr);
        
        return py::extract<string>(result);

    } catch (const py::error_already_set& e) {
            PyErr_Print();
            return "py error catched";
    }

    return "unexpected error";

}

string DerivePublicKeyWeb3(string pk){

        cout<<endl<<"python initialized debug "<< python_initialized<<endl;

        if (!python_initialized) {
            Py_Initialize();
            python_initialized = true;
            
        }

    int counterfl = 0;

    try {

        py::object main_module = py::import("__main__");
        py::object main_namespace = main_module.attr("__dict__");
        py::object sys = py::import("sys");
        py::object sys_path = sys.attr("path");
        sys_path.attr("insert")(0, "");

        py::exec_file("PyScripts/operateSM.py", main_namespace);
        py::object result = main_namespace["deriveFromPriv"](pk);

        string resultstr = py::extract<string>(result);

        return resultstr;

    } catch (const py::error_already_set& e) {
            PyErr_Print();
            return "py error catched";
    }

    return "unexpected error";

}

#endif


