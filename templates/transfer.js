var serverurl = window.location.origin;

checkpk = false
checkaddress = false
checkvalue = false
publicderived = false

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
                GetBalanceAddress()
                publicderived = true
            }

        } catch (error) {
            console.log("error ",error);
        }

    }

}

async function GetBalanceAddress(){

    try {

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

    var selectElement = document.getElementById('Networks');

    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }

    responsedata.forEach(opcion => {

      NetworkData = JSON.parse(opcion)
      const optionElement = document.createElement('option');
      optionElement.value = NetworkData["networkName"]; 
      optionElement.textContent = NetworkData["networkName"]; 
      selectElement.appendChild(optionElement);

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


