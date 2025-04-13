var serverurl = window.location.origin;

var checkpk = false
var checkaddress = false
var checkvalue = false
var publicderived = false


function ullToHex(ullValue) {

    let hex = ullValue.toString(16);
    while (hex.length < 16) {
      hex = "0" + hex;
    }
    return hex;
}

function uint8ArrayToHexString(uint8Array) {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function deleteleftzeroes(str) {
    if (str === null || str === undefined || str === "") {
      return "";
    }
    if (str.startsWith("0") && str.length > 1 && str[1] !== ".") {
      return str.substring(1).replace(/^0+/, '');
    }
    return str;
  }

function sixdecimals(value) {
    if (typeof value !== 'string') {
        value = String(value); 
    }
    
    let decimalPart = '';
    let integerPart = '';
    
    if (value.length <= 6) {
        decimalPart = value.padStart(6, '0');
        integerPart = '0';
    } else {
        const Index = value.length - 6;
        decimalPart = value.slice(Index);
        integerPart = value.slice(0, Index);
    } 
    
    // Formatear la parte entera con comas cada 3 dígitos
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return integerPart + '.' + decimalPart;
}

function checkAddress(address) {
    const regex = /^0x[0-9a-fA-F]{40}$/;

    console.log("checkAddress ", address)

    if(regex.test(address)){
        checkaddress = true
    } else {
        checkaddress = false
    }

    return checkaddress;
}

function checkPrivate(pkey) {

    if (pkey.startsWith('0x') && pkey.length === 66) {
        pkey = pkey.slice(2); 
    }
    const regex = /^[0-9a-fA-F]{64}$/;

    if(regex.test(pkey)){
        checkpk = true

    } else {
        publicderived = false
        checkpk = false
    }
    return checkpk;

}

async function retrieveAddressInfo(){

    checkPrivate(document.getElementById('privKeyValue').value)

    if(checkpk && !publicderived){

        try {

            const response = await fetch(serverurl+"/test_transfer", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"request": "getPublic",
                                  "pk": document.getElementById("privKeyValue").value,
                                   })
            })
        
            var data = await response.text()
            console.log("retrieveAddressInfo response: ", data)

            if(checkAddress(data)){
                document.getElementById('Address').textContent = data
                publicderived = true
            }

        } catch (error) {
            console.log("error ",error);
        }

    }



}

async function GetBalanceAddress(){

    try {

        if(publicderived){

            jsonValues = JSON.stringify({ 
            "network": document.getElementById("Networks").value,
            "option": "balanceOf",
            "Address": document.getElementById('Address').textContent,
            })
    
            const response = await fetch(serverurl+"/api", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  "request": "getBalanceW3", 
                                    "values": jsonValues,
                                    })
            })
    
            var data = await response.text()

            console.log("GetBalanceAddress response query ", data)
            
            document.getElementById('balance').textContent = sixdecimals(data)

            estimateGas()
            
        }


    } catch (error) {
        console.log("error ",error);
    }

}

async function updateNetworkIndexSelect() {

    try {

      const response = await fetch(serverurl+"/api", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({  "request": "savedNetworks", 
                            })
    })

    var responsedata = await response.json()

    var selectorFrom = document.getElementById('Networks');

    while (selectorFrom.firstChild) {
        selectorFrom.removeChild(selectorFrom.firstChild);
    }



    responsedata.forEach(opcion => {

      NetworkData = JSON.parse(opcion)
      const optionElement = document.createElement('option');
      optionElement.value = NetworkData["networkName"]; 
      optionElement.textContent = NetworkData["networkName"]; 
      selectorFrom.appendChild(optionElement);
      
    });

	document.getElementById('Networks').value = (document.cookie.match('(^|;)\\s*' + "networkSet" + '\\s*=\\s*([^;]+)') || [])[2] || null
    retrieveinfo()
    GetBalanceAddress()
    estimateGas()


    } catch (error) {

    }
  
}

async function retrieveinfo(){

    try {
      const response = await fetch(serverurl+"/api", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({"request": "CryptoInfo",
                            "network": document.getElementById("Networks").value,
                             })
      })
  
        var data = await response.json()

        document.getElementById('networkName').textContent = data["networkName"];
        document.getElementById('name').textContent = data["name"];
        document.getElementById('symbolName').textContent = data["symbol"];

    } catch (error) {
        console.log("error ",error);
        }
  
}

function IndexAddress() {
    Address = document.getElementById('IndexAddress').value;
    console.log(Address)
    window.open(serverurl+"/AddressIndexing/"+Address, '_blank');
}

async function estimateGas(){

    amount = parseInt(getIntAmount(document.getElementById('AmountTransfer').value))
    checkAddress(document.getElementById('AddressToTransfer').value)

    if( checkpk && checkaddress && publicderived && amount > 0 ){


        fromAddress = document.getElementById('Address').textContent
        addressReceiver = document.getElementById('AddressToTransfer').value
        network = document.getElementById("Networks").value

        jsonValues = JSON.stringify({ 
            "network": network,
            "option": "estimateGas",
            "from": fromAddress, 
            "to": addressReceiver,
            "amount": amount,
            })

        try {
            const response = await fetch(serverurl+"/test_transfer", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  "request": "estimateGas", 
                                    "values": jsonValues,
                                    })

        })




        var data = await response.text()

        let gas = document.getElementById('gasTransaction');
        gas.textContent = data;



        } catch (error) {
            console.log("error ",error);
        }

    }
  
}

function getIntAmount(value) {
    const parts = value.replace(/,/g, '').split('.');
    const integerPart = parts[0] || '0';
    const decimalPart = (parts[1] || '0').padEnd(decimalPlaces, '0');
    return  deleteleftzeroes(integerPart + decimalPart);
  
}

async function SendTransfer(){
    
    if( checkpk && checkaddress && publicderived && amount > 0 ){

        jsonValues = JSON.stringify({ 
          "network": document.getElementById("Networks").value,
          "networkTo": document.getElementById("Networks").value,
          "option": "transfer",
          "to": document.getElementById('AddressToTransfer').value, 
          "amount": parseInt(getIntAmount(document.getElementById('AmountTransfer').value)),
          "privateKey": document.getElementById("privKeyValue").value,
         })
      
        try {
          const response = await fetch(serverurl+"/test_transfer", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({  "request": "transfer", 
                                  "values": jsonValues,
                                 })
        })
      
        var data = await response.text()

        console.log("send transfer ", data)
      
        alert("operation result: "+data)
      
        } catch (error) {
            console.log("error ",error);
        }

    }
}

function deriveEthAddressFromKey() {
    try {

      if(!checkPrivate(document.getElementById("privKeyValue").value)){
        return 
      }

      const privatekey = document.getElementById("privKeyValue").value

      const wallet = new ethers.Wallet(privatekey);
      console.log(wallet.address);
      document.getElementById('Address').textContent = wallet.address
      publicderived=true;

      return

    } catch (error) {
      console.error("Error deriving Ethereum address:", error);
      return null; 
    }
}

async function signTransaction(){

    if(!checkPrivate(document.getElementById("privKeyValue").value)){
        return 
    }
    
    if(!checkAddress(document.getElementById("AddressToTransfer").value)){
        return 
    }

    const privatekey = document.getElementById("privKeyValue").value
    const wallet = new ethers.Wallet(privatekey);

    if( checkpk && checkaddress && publicderived && amount > 0 ){

        jsonValues = JSON.stringify({ 
          "network": document.getElementById("Networks").value,
          "networkTo": document.getElementById("Networks").value,
          "option": "GetDataTransfer",
          "to": document.getElementById('AddressToTransfer').value, 
          "amount": parseInt(getIntAmount(document.getElementById('AmountTransfer').value)),
          "privateKey": document.getElementById("privKeyValue").value,
         })
      
        try {
          const DataTransfer = await fetch(serverurl+"/test_transfer", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({  "request": "transfer", 
                                  "values": jsonValues,
                                 })
        })
      
        var data = await DataTransfer.json()

        

        const signedTransaction = await wallet.signTransaction(data)

        console.log("signedTransaction ", signedTransaction)

        jsonValues = JSON.stringify({ 
            "network": document.getElementById("Networks").value,
            "networkTo": document.getElementById("Networks").value,
            "option": "SendSidnedTransfer",
            "signedTransfer": signedTransaction,
           })

        const statusSignedTransfer = await fetch(serverurl+"/test_transfer", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  "request": "transfer", 
                                    "values": jsonValues,
                                   })
          })

           var statustransfer = await statusSignedTransfer.text()
           
           
           alert("Status transfer "+statustransfer)
      
        } catch (error) {
            console.log("error ",error);
        }

    }

}

async function WalletAdmin(){
	
	loadWalletsManagementSelector()
	loadAddressManagementSelector()

    let NetworkSettings = document.getElementById('Transfers');
    NetworkSettings.style.display = 'none'; 
    let networksidebar = document.getElementById('wallets');
    networksidebar.style.display = 'grid'; 


  
}

async function Transfer(){
	
	loadWalletsTransferSelector()
	loadAddressTransferSelector()
    let NetworkSettings = document.getElementById('wallets');
    NetworkSettings.style.display = 'none'; 
    let networksidebar = document.getElementById('Transfers');
    networksidebar.classList.remove('active');
    networksidebar.style.display = 'grid'; 
  
}

async function storePrivateKey(){

    let privKey = await document.getElementById("SavePrivKey").value
    const wallet = await new ethers.Wallet(privKey);

    if(!checkPrivate(privKey)){
        return 
    }

    pass =  prompt("Password encryption:")
    
    if(pass.length === 0 ){
		return
	}

    const key = await window.crypto.subtle.importKey(
        "raw",
        hexStringToUint8Array(await calculateSHA3Hash(pass)),
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
    );

    const walletName = prompt("Wallet Name:");
    
    if(walletName.length === 0 ){
		return
	}
    
    const walletaddress =  await wallet.address
    const ciphertext = await encryptText(privKey, key);
    const dataenctypted  = ciphertext

    jsonValues = JSON.stringify({ 
        "address": walletaddress,
        "name": walletName,
        "dataEncrypted": dataenctypted,

       })
    
      try {
        const response = await fetch(serverurl+"/test_transfer", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  "request": "keyStorage", 
                                "values": jsonValues,
                               })
      })
    
      var data = await response.text()

      loadWalletsManagementSelector()
      loadWalletsTransferSelector()

       alert("status operation "+data)
    } catch (error) {
        console.log("error ",error);
    }
}

async function storeAddress(){

    const address = document.getElementById("saveAddress").value
    
    if(!checkAddress(address)){
		return
	}
    
    AddressName =  prompt("AddressName")
    
    if(AddressName.length === 0 ){
		return
	}

    jsonValues = JSON.stringify({ 
        "address": address,
        "name": AddressName,
       })
    
      try {
        const response = await fetch(serverurl+"/test_transfer", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  "request": "addressStorage", 
                                "values": jsonValues,
                               })
      })
    
      var data = await response.text()

      alert("status operation "+data)
      loadAddressManagementSelector()
      loadAddressTransferSelector()
    } catch (error) {
        console.log("error ",error);
    }
}

async function DecryptWallet(pass , ciphertext){

    const key2 = await window.crypto.subtle.importKey(
        "raw",
        hexStringToUint8Array(await calculateSHA3Hash(pass)),
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
      );
      
      return await decryptText(ciphertext, key2)

}

async function loadWallets() {

      try {
        const response = await fetch(serverurl+"/test_transfer", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  "request": "walletsStored", 
                              })
      })
  
      return await response.json()
  
      } catch (error) {
  
      }
    }
    
  
async function loadAddress() {

      try {
        const response = await fetch(serverurl+"/test_transfer", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  "request": "addressesStored", 
                              })
      })
  
      return await response.json()
  
      } catch (error) {
  
      }
    }
  
async function loadWalletsManagementSelector(){
	 
	 wallets = await loadWallets()
	 
	 console.log("wallets ", wallets)

      var selectElement = document.getElementById('keyStored');
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      wallets.forEach(opcion => {
        NetworkData = JSON.parse(opcion)
        const optionElement = document.createElement('option');
        optionElement.value = NetworkData["address"]; 
        optionElement.textContent = NetworkData["name"]; 
        selectElement.appendChild(optionElement);
      });
  
      networkSelectUpdated = true;
      selectElement.addEventListener("change", function() {
  
        console.log("magico my dubi")
  
      });
	 
}
 
async function loadAddressManagementSelector(){
	 
	 wallets = await loadAddress()
	 
	 console.log("wallets ", wallets)

      var selectElement = document.getElementById('deleteAddress');
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      wallets.forEach(opcion => {
        NetworkData = JSON.parse(opcion)
        const optionElement = document.createElement('option');
        optionElement.value = NetworkData["address"]; 
        optionElement.textContent = NetworkData["name"]; 
        selectElement.appendChild(optionElement);
      });
  
      networkSelectUpdated = true;
      selectElement.addEventListener("change", function() {
  
        console.log("magico my dubi")
  
      });
	 
}
 
cryptowalletLoaded = false;
  
async function loadWalletsTransferSelector(){
	 
	 wallets = await loadWallets()
	 
	 console.log("wallets ", wallets)

      var selectElement = document.getElementById('walletsTransfer');
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      
        const emtyElement = document.createElement('option');
        emtyElement.value = ""; 
        emtyElement.textContent = ""; 
        selectElement.appendChild(emtyElement);
      
      
      wallets.forEach(opcion => {
        NetworkData = JSON.parse(opcion)
        const optionElement = document.createElement('option');
        optionElement.value = NetworkData["dataEncrypted"]; 
        optionElement.textContent = NetworkData["name"]; 
        selectElement.appendChild(optionElement);
      });
  
      networkSelectUpdated = true;
      selectElement.addEventListener("change", async function() {

        
        let accountSelected = document.getElementById('walletsTransfer').value
        
        console.log("accountSelected" , accountSelected)
        
        if(accountSelected != 0){
			
			pass = prompt("Password decrypt:")
			
			try{
				
				pk =  await DecryptWallet( pass , accountSelected )
				if(checkPrivate(pk)) {
					document.getElementById('privKeyValue').value = pk
          deriveEthAddressFromKey()
					publicderived = true
					retrieveAddressInfo()
					GetBalanceAddress()
				} else {
					publicderived = false
					alert("Invalid Password")
					document.getElementById('walletsTransfer').value = 0
				}
			} catch (error){
				alert("Invalid Password")
				document.getElementById('walletsTransfer').value = 0
			}
			
		}
        
      });
	 
}
 
  async function loadAddressTransferSelector(){
	 
	 wallets = await loadAddress()
	 
	 console.log("wallets ", wallets)

      var selectElement = document.getElementById('addressTransfer');
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      
      
         const emtyElement = document.createElement('option');
        emtyElement.value = ""; 
        emtyElement.textContent = ""; 
        selectElement.appendChild(emtyElement);
      
      
      wallets.forEach(opcion => {
        NetworkData = JSON.parse(opcion)
        const optionElement = document.createElement('option');
        optionElement.value = NetworkData["address"]; 
        optionElement.textContent = NetworkData["name"]; 
        selectElement.appendChild(optionElement);
      });
  
      selectElement.addEventListener("change", function() {
  
        document.getElementById('AddressToTransfer').value = document.getElementById('addressTransfer').value
  
      });
	 
}
 
 
  
  
  
function hexStringToUint8Array(hexString) {
    const hexArray = hexString.match(/.{1,2}/g);
    return new Uint8Array(hexArray.map(byte => parseInt(byte, 16)));
}

async function calculateSHA3Hash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
  
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => ("00" + byte.toString(16)).slice(-2)).join("");
  
    return hashHex;
  }

async function encryptText(text, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
  
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      key,
      data
    );
  
    const encryptedBytes = new Uint8Array(encryptedData);
    const encryptedHex = Array.prototype.map
      .call(encryptedBytes, byte => ("00" + byte.toString(16)).slice(-2))
      .join("");
  
    const ivHex = Array.prototype.map
      .call(iv, byte => ("00" + byte.toString(16)).slice(-2))
      .join("");
  
    return ivHex + encryptedHex;
  }

async function decryptText(ciphertext, key) {
	
    const iv = ciphertext.slice(0, 32);
    const encryptedDataHex = ciphertext.slice(32);
  
    const encryptedBytes = new Uint8Array(encryptedDataHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: new Uint8Array(iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
      },
      key,
      encryptedBytes
    );
  
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

async function deleteWallet(){
	
	try {
        const response = await fetch(serverurl+"/test_transfer", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  "request": "deleteKey", 
								"address": document.getElementById("keyStored").value,
                              })
      })
  
      var responsedata = await response.text()
      loadWalletsManagementSelector()
      loadWalletsTransferSelector()
      alert("status operation "+responsedata)
	
	} catch (error) {
  
      }
}

async function deleteAddress(){
	
	try {
        const response = await fetch(serverurl+"/test_transfer", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({  "request": "deleteAddress", 
								"address": document.getElementById("deleteAddress").value,
                              })
      })
  
      var responsedata = await response.text()
      loadAddressTransferSelector()
      loadAddressManagementSelector()
      alert("status operation "+responsedata)
	
	} catch (error) {
  
      }
}


window.onload = function() {
	loadWalletsTransferSelector()
}
