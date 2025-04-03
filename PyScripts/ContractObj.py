import json
from PyScripts.rpc_connection import W3

compiled_contract_path = './Deployment/build/contracts/regulatedStableCoin.json'
# Deployed contract address (see `migrate` command output: `contract address`)
contract_address = '0x1f7Fc13acD82e35491cd25fc482Ab58220917e2f'

with open(compiled_contract_path) as file:
    contract_json = json.load(file)  # load contract info as JSON
    contract_abi = contract_json['abi']  # fetch contract's abi - necessary to call its functions

Contract = W3.eth.contract(address=contract_address, abi = contract_abi)

def contract(sm_address, web3Obj):

    contract_address = sm_address

    with open(compiled_contract_path) as file:
        contract_json = json.load(file)  

    return web3Obj.eth.contract(address=contract_address, abi = contract_abi)

