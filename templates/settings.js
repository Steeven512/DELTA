var serverurl = window.location.origin;

//setings network

networkSelectUpdated = false;

async function updateNetworkSelect() {

  if(!networkSelectUpdated){
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

          networkSelectUpdated = true;

        }

      });

    });

    } catch (error) {

    }
  }
}

networkSMSelectUpdated = false;

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

async function updateNetworkIndexSelect() {

  if(!networkSelectUpdated){
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

    } catch (error) {

    }
  }
}

async function setNetworkEdit() {

  var networkNameSet = document.getElementById("Networks").value
  var networkidSet = document.getElementById("networkidSetEdit").value
  var networkRPCSet = document.getElementById("networkRPCSetEdit").value
  var networkSmartContractAddressSet = document.getElementById("networkSmartContractAddressSetEdit").value

  jsonset = JSON.stringify({

    "networkName": networkNameSet,
    "networkid": networkidSet,
    "rpc_address": networkRPCSet,
    "sm_address": networkSmartContractAddressSet,

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

    networkSelectUpdated = false;


  } catch (error) {
    console.log("error ",error);
  }

}

async function setNetwork() {

  var networkNameSet = document.getElementById("networkNameSet").value
  var networkidSet = document.getElementById("networkidSet").value
  var networkRPCSet = document.getElementById("networkRPCSet").value
  var networkSmartContractAddressSet = document.getElementById("networkSmartContractAddressSet").value

  jsonset = JSON.stringify({

    "networkName": networkNameSet,
    "networkid": networkidSet,
    "rpc_address": networkRPCSet,
    "sm_address": networkSmartContractAddressSet,

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

    networkSelectUpdated = false;

  } catch (error) {
    console.log("error ",error);
  }

}

async function displayNetWorksSetting(){

  let SM = document.getElementById('SM');
  SM.style.display = 'none'; 

  let smsidebar = document.getElementById('smsidebar');
  smsidebar.classList.remove('active');

  
  let NetworkSettings = document.getElementById('NetworkSettings');
  NetworkSettings.style.display = 'grid'; 

  let networksidebar = document.getElementById('networksidebar');

  networksidebar.classList.add("active")


}

async function displaySMSettings(){

  let NetworkSettings = document.getElementById('NetworkSettings');
  NetworkSettings.style.display = 'none'; 
  let networksidebar = document.getElementById('networksidebar');
  networksidebar.classList.remove('active');

  let SM = document.getElementById('SM');
  SM.style.display = 'grid'; 

  let smsidebar = document.getElementById('smsidebar');
  smsidebar.classList.add("active")

  updateNetworkSelectSM()

}

function requestPK(){

  return prompt('Admin Private Key');

}

async function increaseSupply(){

  privateKey = requestPK()
  amount = document.getElementById('increaseSupply').value
  network = document.getElementById("Networks").value

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
  network = document.getElementById("Networks").value

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
  network = document.getElementById("Networks").value

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
  network = document.getElementById("Networks").value

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

  network = document.getElementById("Networks").value

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

async function freeze(){

  privateKey = requestPK()
  account = document.getElementById('freeze').value

  network = document.getElementById("Networks").value

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

  network = document.getElementById("Networks").value

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

  network = document.getElementById("Networks").value

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
  network = document.getElementById("Networks").value

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
  network = document.getElementById("Networks").value

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




