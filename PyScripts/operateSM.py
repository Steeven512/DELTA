import json
from PyScripts.ContractObj import contract
from PyScripts.rpc_connection import RPC


def string_to_uint256(input_string):
    """
    Converts a string representing an integer to a uint256 (unsigned 256-bit integer).

    Args:
        input_string: The string representation of the integer.

    Returns:
        The integer value as an int if within the uint256 range, or None if invalid.
    """
    try:
        int_value = int(input_string)  # Convert the string to an integer
        if 0 <= int_value < 2**256:  # Check if it's within uint256 range
            return int_value
        else:
            return None  # Out of range
    except ValueError:
        return None  # Not a valid integer string

"""

# Example usage:
valid_uint256_string = "12345678901234567890"
invalid_uint256_string = "-123"
too_large_string = str(2**256)
not_a_number = "abc"

valid_result = string_to_uint256(valid_uint256_string)
invalid_result = string_to_uint256(invalid_uint256_string)
large_result = string_to_uint256(too_large_string)
nan_result = string_to_uint256(not_a_number)

if valid_result is not None:
    print(f"Valid uint256: {valid_result}")
else:
    print("Invalid uint256 string.")

if invalid_result is not None:
    print(f"Invalid uint256: {invalid_result}")
else:
    print("Invalid uint256 string.")

if large_result is not None:
    print(f"Too large uint256: {large_result}")
else:
    print("Invalid uint256 string.")

if nan_result is not None:
    print(f"not a number uint256: {nan_result}")
else:
    print("Invalid uint256 string.")

#Example of the max value
max_uint256 = 2**256 -1
max_uint_string = str(max_uint256)
max_result = string_to_uint256(max_uint_string)

if max_result is not None:
    print(f"Max uint256: {max_result}")
else:
    print("Invalid uint256 string.")

"""

def inCirculation(RPC_Networkd_Address, sm_address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)

    inReserve = Contract.functions.balanceOf(Contract.functions.getOwner().call()).call()
    totalSupply = Contract.functions.totalSupply().call()

    if inReserve>totalSupply:
        return  inReserve - totalSupply
    else :
        return totalSupply - inReserve

def inReserve(RPC_Networkd_Address, sm_address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)

    return Contract.functions.balanceOf(Contract.functions.getOwner().call()).call()

def totalSupply(RPC_Networkd_Address, sm_address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    result = Contract.functions.totalSupply().call()
    return result

def getOwner(RPC_Networkd_Address, sm_address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    return Contract.functions.getOwner().call()

def name(RPC_Networkd_Address, sm_address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    return Contract.functions.name().call()

def symbol(RPC_Networkd_Address, sm_address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    return Contract.functions.symbol().call()

def SmartContracInfo(RPC_Networkd_Address, sm_address):

    admin = getOwner(RPC_Networkd_Address, sm_address)
    _totalsupply = totalSupply(RPC_Networkd_Address, sm_address)
    _inReserve = inReserve(RPC_Networkd_Address, sm_address)
    _inCirculation = inCirculation(RPC_Networkd_Address, sm_address)
    _name = name(RPC_Networkd_Address, sm_address)
    _symbol = symbol(RPC_Networkd_Address, sm_address)

    data = {
        "admin": admin,
        "totalSupply": _totalsupply,
        "inReserve": _inReserve,
        "inCirculation": _inCirculation,
        "name": _name,
        "symbol": _symbol,
    }

    return json.dumps(data)

def unpause(RPC_Networkd_Address, sm_address, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.unpause().estimate_gas({'from': account.address})

    transaction = Contract.functions.unpause().build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def pause(RPC_Networkd_Address, sm_address, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.pause().estimate_gas({'from': account.address})

    transaction = Contract.functions.pause().build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def wipeFrozenAddress(RPC_Networkd_Address, sm_address, address, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.wipeFrozenAddress(address).estimate_gas({'from': account.address})

    transaction = Contract.functions.wipeFrozenAddress(address).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def unfreeze(RPC_Networkd_Address, sm_address, address, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.unfreeze(address).estimate_gas({'from': account.address})

    transaction = Contract.functions.unfreeze(address).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def freeze(RPC_Networkd_Address, sm_address, address, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.freeze(address).estimate_gas({'from': account.address})

    transaction = Contract.functions.freeze(address).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def decreaseSupply(RPC_Networkd_Address, sm_address, address, amount, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.decreaseSupplyFromAddress(amount, address ).estimate_gas({'from': account.address})

    transaction = Contract.functions.decreaseSupplyFromAddress(amount, address).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def mint(RPC_Networkd_Address, sm_address, address, amount, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.mint(address, amount).estimate_gas({'from': account.address})

    transaction = Contract.functions.mint(address, amount).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def increaseSupply(RPC_Networkd_Address, sm_address, amount, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.increaseSupply(amount).estimate_gas({'from': account.address})

    transaction = Contract.functions.increaseSupply(amount).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def burn(RPC_Networkd_Address, sm_address, amount, private_key):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    account = W3.eth.account.from_key(private_key)
    nonce = W3.eth.get_transaction_count(account.address)
    gas_estimate = Contract.functions.burn(amount).estimate_gas({'from': account.address})

    transaction = Contract.functions.burn(amount).build_transaction({
        'from': account.address,
        'gas': gas_estimate,
        'nonce': nonce,
    })

    signed_txn = W3.eth.account.sign_transaction(transaction, private_key)
    return W3.eth.send_raw_transaction(signed_txn.rawTransaction) #return hash transaction

def balanceOf(RPC_Networkd_Address, sm_address, address):

    W3 = RPC(RPC_Networkd_Address)
    Contract = contract(sm_address, W3)
    result = Contract.functions.balanceOf(address).call()

    return str(result) 

def performTransactionSM(RPC_Networkd_Address, sm_address, options_sm):

    transactionValues = json.loads(options_sm)

    if(transactionValues["option"] == "balanceOf"):

        return balanceOf(RPC_Networkd_Address, sm_address, transactionValues["Address"])

    if(transactionValues["option"] == "increaseSupply"):

        amount = string_to_uint256(transactionValues["amount"])

        return increaseSupply(RPC_Networkd_Address, sm_address, amount, transactionValues["privateKey"])

    if(transactionValues["option"] == "burn"):

        amount = string_to_uint256(transactionValues["amount"])

        return burn(RPC_Networkd_Address, sm_address, amount, transactionValues["privateKey"])

    if(transactionValues["option"] == "mint"):

        amount = string_to_uint256(transactionValues["amount"])

        return mint(RPC_Networkd_Address, sm_address, transactionValues["account"], amount, transactionValues["privateKey"])


    if(transactionValues["option"] == "decreaseSupply"):

        amount = string_to_uint256(transactionValues["amount"])

        return decreaseSupply(RPC_Networkd_Address, sm_address, transactionValues["account"], amount, transactionValues["privateKey"])

    if(transactionValues["option"] == "freeze"):

        return freeze(RPC_Networkd_Address, sm_address, transactionValues["account"], transactionValues["privateKey"])

    if(transactionValues["option"] == "unfreeze"):

        return unfreeze(RPC_Networkd_Address, sm_address, transactionValues["account"], transactionValues["privateKey"])

    if(transactionValues["option"] == "wipeFrozenAddress"):

        return wipeFrozenAddress(RPC_Networkd_Address, sm_address, transactionValues["account"], transactionValues["privateKey"])

    if(transactionValues["option"] == "pause"):

        return pause(RPC_Networkd_Address, sm_address, transactionValues["privateKey"])

    if(transactionValues["option"] == "unpause"):

        return unpause(RPC_Networkd_Address, sm_address, transactionValues["privateKey"])

    if(transactionValues["option"] == "getOwner"):

        return getOwner(RPC_Networkd_Address, sm_address)

    if(transactionValues["option"] == "totalSupply"):

        return totalSupply(RPC_Networkd_Address, sm_address)

    if(transactionValues["option"] == "inReserve"):

        return inReserve(RPC_Networkd_Address, sm_address)

    if(transactionValues["option"] == "inCirculation"):

        return inCirculation(RPC_Networkd_Address, sm_address)

    if(transactionValues["option"] == "SmartContracInfo"):

        return SmartContracInfo(RPC_Networkd_Address, sm_address)



