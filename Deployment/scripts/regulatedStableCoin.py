from brownie import regulatedStableCoin, accounts

def main():

    pk = ""

    #load account from private
    acct = accounts.add(pk)
    address = acct.address
    balance = acct.balance()

    print("Publc Address Ethereum:", address)
    print("Account balance:", balance)

    gas_estimate = regulatedStableCoin.deploy.estimate_gas( "Regulated Stable Coin", "RSC", 2 ,25600000000000,{"from": acct})
    print(f"Estimated gas: {gas_estimate}")

    constructor_params = {
        'gas_limit': gas_estimate 
    }

    contract = regulatedStableCoin.deploy( "Regulated Stable Coin", "RSC", 2 , 25600000000000, {'from': acct, **constructor_params})
