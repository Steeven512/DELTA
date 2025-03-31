from web3 import Web3


sepolia = "set_Google_rpc"
ganache = 'http://127.0.0.1:7545'

W3 = Web3(Web3.HTTPProvider(ganache))

def RPC(RPC_Network_Address):
    return Web3(Web3.HTTPProvider(RPC_Network_Address))
