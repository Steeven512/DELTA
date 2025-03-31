#include <iostream>
#include <boost/python.hpp>
#include <vector>

using namespace std;

vector<string> convert_python_list_to_vector(boost::python::object py_list) {

    vector<string> result;
    boost::python::ssize_t length = boost::python::len(py_list);
  
    for (boost::python::ssize_t i = 0; i < length; ++i) {
        string element = boost::python::extract<string>(py_list[i]);
        result.push_back(element);
    }

    return result;
}

vector<string> EthEvents(string RPC_Network, string SM_address, uint64_t from, uint64_t To){

    namespace py = boost::python;
    Py_Initialize();
    py::object main_module = py::import("__main__");
    py::object main_namespace = main_module.attr("__dict__");
    std::vector<string> cpp_vector;

    try {

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

    uint64_t bl= 0;
    namespace py = boost::python;
    Py_Initialize();
    py::object main_module = py::import("__main__");
    py::object main_namespace = main_module.attr("__dict__");

    try {

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


