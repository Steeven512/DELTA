from PyScripts.ContractObj import contract
from PyScripts.rpc_connection import RPC
import json

def latestEthBlockN(RPC_Networkd_Address):
    return RPC(RPC_Networkd_Address).eth.get_block_number()

def eventsIndexer(RPC_Networkd_Address, SM_address, fromBlock, toBlock):

    W3 = RPC(RPC_Networkd_Address)
    result = []
    accountBalanceUpdate_topic = W3.keccak(text="accountBalanceUpdate(address,uint256)").hex()
    transfer_topic = W3.keccak(text="Transfer(address,address,uint256)").hex()
    approval_topic = W3.keccak(text="Approval(address,address,uint256)").hex()
    pause_topic = W3.keccak(text="Pause()").hex()
    unpause_topic = W3.keccak(text="Unpause()").hex()
    frozenAddressWiped_topic = W3.keccak(text="FrozenAddressWiped(address)").hex()
    freezeAddress_topic = W3.keccak(text="FreezeAddress(address)").hex()
    unfreezeAddress_topic = W3.keccak(text="UnfreezeAddress(address)").hex()
    supplyDecreased_topic = W3.keccak(text="SupplyDecreased(address,uint256)").hex()
    supplyIncreased_topic = W3.keccak(text="SupplyIncreased(address,uint256)").hex()
    
    logs = W3.eth.get_logs({
        'address': SM_address,
        'fromBlock': fromBlock,
        'toBlock': toBlock,
        'topics': [
            [accountBalanceUpdate_topic, transfer_topic, approval_topic, pause_topic, unpause_topic, frozenAddressWiped_topic, freezeAddress_topic, unfreezeAddress_topic, supplyDecreased_topic, supplyIncreased_topic]
        ]
    })

    if(len(logs) == 0 ):

        data = {"event": "emty"}

        result.append(json.dumps(data))

        return result

    Contract = contract(SM_address, W3)


       
          

    for log in logs:

        print(log)

        event_signature = log['topics'][0].hex()

        if event_signature == accountBalanceUpdate_topic:

            event = Contract.events.accountBalanceUpdate().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            Account = event['args']['Account']
            balances = event['args']['balances']

            data = {"event": "accountBalanceUpdate", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "Account": Account,
                    "balances": balances }
            
            result.append(json.dumps(data))

        elif event_signature == transfer_topic:

            event = Contract.events.Transfer().process_log(log)

            print(event)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']

            data = {"event": "Transfer", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "from": event['args']['from'],
                    "to": event['args']['to'],
                    "value": event['args']['value']}

            result.append(json.dumps(data))

            print(f"Transfer Event: {event}")

        elif event_signature == approval_topic:

            event = Contract.events.Approval().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            owner = event['args']['owner']
            spender = event['args']['spender']
            value = event['args']['value']

            data = {"event": "Approval", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "owner": owner,
                    "spender": spender,
                    "value": value}

            result.append(json.dumps(data))

        elif event_signature == pause_topic:

            event = Contract.events.Pause().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']

            data = {"event": "Pause", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,}

            result.append(json.dumps(data))

        elif event_signature == unpause_topic:

            event = Contract.events.Unpause().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']


            data = {"event": "Unpause", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,}

            result.append(json.dumps(data))

        elif event_signature == frozenAddressWiped_topic:

            event = Contract.events.FrozenAddressWiped().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            addr = event['args']['addr']

            data = {"event": "FrozenAddressWiped", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "addr" : addr}

            result.append(json.dumps(data))

        elif event_signature == freezeAddress_topic:

            event = Contract.events.FreezeAddress().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            addr = event['args']['addr']

            data = {"event": "FreezeAddress", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "addr" : addr}

            result.append(json.dumps(data))

        elif event_signature == unfreezeAddress_topic:

            event = Contract.events.UnfreezeAddress().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            addr = event['args']['addr']

            data = {"event": "UnfreezeAddress", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'], 
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "addr" : addr}

            result.append(json.dumps(data))

        elif event_signature == supplyDecreased_topic:

            event = Contract.events.SupplyDecreased().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            From = event['args']['from']
            value = event['args']['value']

            data = {"event": "SupplyDecreased", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "from" : From,
                    "value" : value}

            result.append(json.dumps(data))

        elif event_signature == supplyIncreased_topic:

            event = Contract.events.SupplyIncreased().process_log(log)

            blockNumber = event['blockNumber']
            transactionIndex = event['transactionIndex']
            logIndex = event['logIndex']
            to = event['args']['to']
            value = event['args']['value']

            data = {"event": "SupplyIncreased", 
                    "timestamp": W3.eth.get_block(event['blockNumber'])['timestamp'],
                    "blockNumber" : blockNumber,
                    "transactionIndex" : transactionIndex,
                    "logIndex" : logIndex,
                    "to" : to,
                    "value" : value}

            result.append(json.dumps(data))


    return result



