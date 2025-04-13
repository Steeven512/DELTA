from ContractObj import Contract

Address = "0x1672c957ddfDFA31317e00E62E9Eb4fa59687f02"
result = Contract.functions.balanceOf(Address).call()
print (result)
