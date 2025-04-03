from PyScripts.rpc_connection import W3

def deriveFromPriv(private_key):
    print("py3 debug")
    return W3.eth.account.from_key(private_key).address


