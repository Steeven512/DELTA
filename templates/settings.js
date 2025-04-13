var serverurl = window.location.origin;

//setings network

networkSelectUpdated = false;
networkSMSelectUpdated = false;

function ullToHex(number) {
  if (typeof number !== 'number' || number < 0 || number > 18446744073709551615) {
    return "Invalid input"; // Or throw an error, depending on your needs
  }
  const hexString = number.toString(16).toUpperCase();
  console.log("skibidi ",hexString.padStart(16, '0') )
  return hexString.padStart(16, '0');
 }

async function updateNetworkSelect() {

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

    networkSelectUpdated = true;

    selectElement.addEventListener("change", function() {

      const selectedValue = this.value; 
      const selectedText = this.options[this.selectedIndex].text;

      responsedata.forEach(opcion => {

        NetworkData = JSON.parse(opcion)

        if(NetworkData["networkName"]===selectedValue){

          let networkidSetEdit = document.getElementById('networkidSetEdit');
          networkidSetEdit.value = NetworkData["networkid"];
      
          let networkRPCSetEdit = document.getElementById('networkRPCSetEdit');
          networkRPCSetEdit.value = NetworkData["rpc_address"];
      
          let networkSmartContractAddressSetEdit = document.getElementById('networkSmartContractAddressSetEdit');
          networkSmartContractAddressSetEdit.value = NetworkData["sm_address"];
          
          document.getElementById('startIndexingFromEdit').value = parseInt(NetworkData["startIndexingFrom"],16)
          document.getElementById('requestIntervalEdit').value = NetworkData["requestInterval"]

        }

      });

    });

    } catch (error) {

    }
  
}

async function updateNetworkSelectSM() {

  if(!networkSMSelectUpdated){
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

    console.log("debug update networksSM", responsedata)

    var selectElement = document.getElementById('NetworksSM');

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

    networkSMSelectUpdated = true;

    } catch (error) {

    }
  }
}


async function setNetworkEdit() {

  var networkNameSet = document.getElementById("Networks").value
  var networkidSet = document.getElementById("networkidSetEdit").value
  var networkRPCSet = document.getElementById("networkRPCSetEdit").value
  var networkSmartContractAddressSet = document.getElementById("networkSmartContractAddressSetEdit").value
  var requestInterval = document.getElementById("requestIntervalEdit").value
  var startIndexingFrom = document.getElementById("startIndexingFromEdit").value

  if(!(networkNameSet || networkidSet || networkRPCSet  || networkSmartContractAddressSet  || startIndexingFrom  || requestInterval 
	|| ((startIndexingFrom) => /\d/.test(startIndexingFrom) )
	||( (requestInterval) => /\d/.test(requestInterval) )
	|| (requestInterval > 0) ) )
	{
		alert("invalid input value")  
	}

  jsonset = JSON.stringify({

    "networkName": networkNameSet,
    "networkid": networkidSet,
    "rpc_address": networkRPCSet,
    "sm_address": networkSmartContractAddressSet,
    "startIndexingFrom": startIndexingFrom,
    "requestInterval": requestInterval,

  })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "networkSet", 
                            "networksetting": jsonset, 
                          })
  })

    var responsedata = await response.text()
    
    if(responsedata == "success" ){
		setBlIndexNewNetwork(networkNameSet, ullToHex(parseInt(startIndexingFrom)))
		alert("network "+networkNameSet+" added sucessfully")
	} else {
		alert("fail storing "+networkNameSet)
		}

    updateNetworkSelect()

  } catch (error) {
    console.log("error ",error);
  }


}

async function setNetwork() {

  var networkNameSet = document.getElementById("networkNameSet").value
  var networkidSet = document.getElementById("networkidSet").value
  var networkRPCSet = document.getElementById("networkRPCSet").value
  var networkSmartContractAddressSet = document.getElementById("networkSmartContractAddressSet").value
  var startIndexingFrom = document.getElementById("startIndexingFrom").value
  var requestInterval = document.getElementById("requestInterval").value
  
  if(!(networkNameSet || networkidSet || networkRPCSet  || networkSmartContractAddressSet  || startIndexingFrom  || requestInterval 
	|| ((startIndexingFrom) => /\d/.test(startIndexingFrom) )
	||( (requestInterval) => /\d/.test(requestInterval) )
	|| (requestInterval > 0) ) )
	{
		alert("invalid input value")  
	}

  jsonset = JSON.stringify({

    "networkName": networkNameSet,
    "networkid": networkidSet,
    "rpc_address": networkRPCSet,
    "sm_address": networkSmartContractAddressSet,
    "startIndexingFrom": startIndexingFrom,
    "requestInterval": requestInterval,

  })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "networkSet", 
                            "networksetting": jsonset, 
                          })
  })

    var responsedata = await response.text()
    
    if(responsedata == "success" ){
		setBlIndexNewNetwork(networkNameSet, ullToHex(parseInt(startIndexingFrom)))
		alert("network "+networkNameSet+" added sucessfully")
	} else {
		alert("fail storing "+networkNameSet)
		}
		
		updateNetworkSelect()

  } catch (error) {
    console.log("error ",error);
  }

}

async function eraseNewtork() {

  jsonset = JSON.stringify({

  })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "eraseNetwork", 
                            "networkName": document.getElementById("Networks").value, 
                          })
  })

    var responsedata = await response.text()
    
    if(responsedata == "success" ){
		alert("network "+document.getElementById("Networks").value+" erased")
	} else {
		alert("deleting fail "+document.getElementById("Networks").value)
		}

    updateNetworkSelect()

  } catch (error) {
    console.log("error ",error);
  }


}


async function setBlIndexNewNetwork(networkNameSet, blnumber) {

  console.log("networksetting " , networkNameSet)

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "SaveLatestIndexedBl", 
                            "networksetting": networkNameSet,
                            "numberBl": blnumber, 
                          })
  })

    var responsedata = await response.text()

    console.log ("status "+responsedata)

  } catch (error) {
    console.log("error ",error);
  }

}


async function setBlIndex() {

  var networkNameSet = document.getElementById("Networks").value
  var blnumber = ullToHex(parseInt(document.getElementById("blnumber").value))

  console.log("networksetting " , networkNameSet)

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "SaveLatestIndexedBl", 
                            "networksetting": networkNameSet,
                            "numberBl": blnumber, 
                          })
  })

    var responsedata = await response.text()

    console.log ("status "+responsedata)

    alert("status "+responsedata)

  } catch (error) {
    console.log("error ",error);
  }

}




async function displayNetWorksSetting(){

  document.getElementById('about').style.display = 'none'; 
  document.getElementById('SM').style.display = 'none'; 
  
  document.getElementById('smsidebar').classList.remove('active');
  document.getElementById('aboutsidebar').classList.remove('active');
  
  document.getElementById('NetworkSettings').style.display = 'grid';
  document.getElementById('networksidebar').classList.add("active")


}

async function displaySMSettings(){

  document.getElementById('about').style.display = 'none'; 
  document.getElementById('NetworkSettings').style.display = 'none'; 
  
  document.getElementById('networksidebar').classList.remove('active');
  document.getElementById('aboutsidebar').classList.remove('active');
  
  document.getElementById('SM').style.display = 'grid';
  document.getElementById('smsidebar').classList.add("active")

  updateNetworkSelectSM()

}

async function displayAbout(){

  document.getElementById('NetworkSettings').style.display = 'none'; 
  document.getElementById('SM').style.display = 'none'; 
  
  document.getElementById('networksidebar').classList.remove('active');
  document.getElementById('smsidebar').classList.remove('active');
  
  document.getElementById('about').style.display = 'grid';
  document.getElementById('aboutsidebar').classList.add("active")

}






function requestPK(){

  return prompt('Admin Private Key');

}

async function increaseSupply(){

  privateKey = requestPK()
  amount = document.getElementById('increaseSupply').value
  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "increaseSupply",
    "amount": amount,
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  console.log(data)

  } catch (error) {
      console.log("error ",error);
  }


}

async function burn(){

  privateKey = requestPK()
  amount = document.getElementById('burn').value
  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "burn",
    "amount": amount,
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }


}

async function mint(){

  privateKey = requestPK()
  mint_address = document.getElementById('mint_address').value
  amount = document.getElementById('mint_amount').value
  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "mint",
    "account": mint_address, 
    "amount": amount,
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }


}

async function decreaseSupply(){

  privateKey = requestPK()
  account = document.getElementById('decreaseSupply_address').value
  amount = document.getElementById('decreaseSupply_value').value
  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "decreaseSupply",
    "account": account, 
    "amount": amount,
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }

}

async function freeze(){

  privateKey = requestPK()
  account = document.getElementById('freeze').value

  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "freeze",
    "account": account, 
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }

}

async function unfreeze(){

  privateKey = requestPK()
  account = document.getElementById('unfreeze').value

  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "unfreeze",
    "account": account, 
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }

}

async function wipeFrozenAddress(){

  privateKey = requestPK()
  account = document.getElementById('wipeFrozenAddress').value

  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "wipeFrozenAddress",
    "account": account, 
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }

}

async function pause(){

  privateKey = requestPK()
  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "pause",
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }

}

async function unpause(){

  privateKey = requestPK()
  network = document.getElementById("NetworksSM").value

  jsonValues = JSON.stringify({ 
    "network": network,
    "option": "unpause",
    "privateKey": privateKey,
   })

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "request": "AdminSM", 
                            "values": jsonValues,
                           })
  })

  var data = await response.text()

  alert("operation result: ",data)

  } catch (error) {
      console.log("error ",error);
  }

}





