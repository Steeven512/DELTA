from PyScripts.rpc_connection import W3

def deriveFromPriv(private_key):

    try:

        result = W3.eth.account.from_key(private_key).address
        return result

    except:

        return "Error web3py deriveKey"

    return 


