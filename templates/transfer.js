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

function checkPrivate(pk) {

    if (pk.startsWith('0x') && pk.length === 66) {
        pk = pk.slice(2); 
    }
    const regex = /^[0-9a-fA-F]{64}$/;

    if(regex.test(pk)){
        checkpk = true

    } else {
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
            console.log(data)
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
            console.log(data)
            document.getElementById('balance').textContent = "$"+sixdecimals(data)

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

    console.log("debug update networks", responsedata)

    var selectorFrom = document.getElementById('Networks');
    var selectorTo = document.getElementById('NetworksTo');

    while (selectorFrom.firstChild) {
        selectorFrom.removeChild(selectorFrom.firstChild);
    }

    while (selectorTo.firstChild) {
        selectorTo.removeChild(selectorTo.firstChild);
    }

    responsedata.forEach(opcion => {

      NetworkData = JSON.parse(opcion)
      const optionElement = document.createElement('option');
      optionElement.value = NetworkData["networkName"]; 
      optionElement.textContent = NetworkData["networkName"]; 
      selectorFrom.appendChild(optionElement);
      
    });

    responsedata.forEach(opcion => {

        NetworkData = JSON.parse(opcion)
        const optionElement = document.createElement('option');
        optionElement.value = NetworkData["networkName"]; 
        optionElement.textContent = NetworkData["networkName"]; 
        selectorTo.appendChild(optionElement);
        
      });

    retrieveinfo()



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

        console.log("debug retrieve info", data)

        let networkName = document.getElementById('networkName');
        networkName.textContent = data["networkName"];


        let name = document.getElementById('name');
        name.textContent = data["name"];

        let symbol = document.getElementById('symbol');
        symbol.textContent = data["symbol"];
    
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

    if( checkpk && checkaddress && publicderived && amount > 0 ){

        fromAddress = document.getElementById('Address').textContent
        addressReceiver = document.getElementById('AddressToTransfer').value
        network = document.getElementById("Networks").value

        console.log(" addressReceiver", addressReceiver)

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
          "networkTo": document.getElementById("NetworksTo").value,
          "option": "transfer",
          "to": document.getElementById('addressReceiver').value, 
          "amount": parseInt(getIntAmount(document.getElementById('AmountTransfer').value)),
          "privateKey": document.getElementById("privKeyValue").value,
         })
      
        try {
          const response = await fetch(serverurl+"/transfer_test", {
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
      
        alert("operation result: ",data)
      
        } catch (error) {
            console.log("error ",error);
        }

    }
}





