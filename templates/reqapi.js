var serverurl = window.location.origin;

function ullToHex(ullValue) {

    let hex = ullValue.toString(16);
    while (hex.length < 16) {
      hex = "0" + hex;
    }
    return hex;
}

function clearTable(){
  const table = document.getElementById('tableEvents');
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  table.appendChild(tableBody); 
}

function eventData(jsonObject){

  console.log(jsonObject["event"])

  if(jsonObject["event"] === "accountBalanceUpdate"){
    return "Address: " +jsonObject["Account"] + " value: "+ jsonObject["balances"]
  }

  if(jsonObject["event"] === "Transfer"){
    return "from: " +jsonObject["from"] + " to: "+ jsonObject["to"] + " value: "+ jsonObject["value"]
  }

  if(jsonObject["event"] === "Approval"){
    return "owner: " +jsonObject["owner"] + " spender: "+ jsonObject["spender"] + " value: "+ jsonObject["value"]
  }

  if(jsonObject["event"] === "FrozenAddressWiped"){
    return "Address: " +jsonObject["addr"] 
  }

  if(jsonObject["event"] === "FreezeAddress"){
    return "Address: " +jsonObject["addr"] 
  }

  if(jsonObject["event"] === "FreezeAddress"){
    return "Address: " +jsonObject["addr"] 
  }

  if(jsonObject["event"] === "SupplyDecreased"){
    return "from: " +jsonObject["from"] 
  }

  if(jsonObject["event"] === "SupplyIncreased"){
    return "to: " +jsonObject["from"] 
  }

}

function createTableRow(logElements, number) {

  const tr = document.createElement('tr');

  let jsonObject = JSON.parse(logElements);

  const td0 = document.createElement('td');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  const td3 = document.createElement('td');
  const td4 = document.createElement('td');
  const td5 = document.createElement('td');

  td0.classList.add('tableEventsCenter');
  td1.classList.add('tableEventsCenter');
  td2.classList.add('tableEventsCenter');
  td3.classList.add('tableEventsCenter');
  td4.classList.add('tableEventsCenter');
  td5.classList.add('tableEventsCenter');

  td0.textContent = number;
  td1.textContent = jsonObject["event"];
  td2.textContent = jsonObject["blockNumber"];
  td3.textContent = jsonObject["transactionIndex"];
  td4.textContent = jsonObject["logIndex"];
  td5.textContent = eventData(jsonObject)

  tr.appendChild(td0);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);

  const tableBody = document.getElementById('table-body');
  tableBody.appendChild(tr);
}

function apprendTh(){

  logElements = ['{"event" : "event", "blockNumber" : "blockNumber", "transactionIndex" : "transactionIndex" , "logIndex" : "logIndex"}'];

  let jsonObject = JSON.parse(logElements);

  const tr = document.createElement('tr');

  const th0 = document.createElement('th');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const th3 = document.createElement('th');
  const th4 = document.createElement('th');

  th0.classList.add('tableEventsLeft');
  th1.classList.add('tableEventsLeft');
  th2.classList.add('tableEventsLeft');
  th3.classList.add('tableEventsLeft');
  th4.classList.add('tableEventsLeft');

  th0.textContent = "N.";
  th1.textContent = jsonObject["event"];
  th2.textContent = jsonObject["blockNumber"];
  th3.textContent = jsonObject["transactionIndex"];
  th4.textContent = jsonObject["logIndex"];

  tr.appendChild(th0);
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);

  const tableBody = document.getElementById('table-body');
  tableBody.appendChild(tr);

}

async function loadtable(araytable){
  clearTable()

  apprendTh()

  for (let i = 0; i < araytable.length; i++) {
    createTableRow(araytable[i],i);
  }

}

async function UpdateContent(){

    var elemento = document.getElementById("TotalSupply")
    elemento.textContent = "Nuevo contenido de texto"
    
}

async function IndexEvents(f, t) {

    from = ullToHex(f).toUpperCase();
    to = ullToHex(t).toUpperCase();

 
    const response = await fetch(serverurl+"/MakeWallet", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({  "from": from, 
        "to": to,
        "filterTransactions": document.getElementById("filterTransactions").checked,
        "filterBalances": document.getElementById("filterBalances").checked,
        "filterApproval": document.getElementById("filterApproval").checked,
        "filterSupply": document.getElementById("filterSupply").checked,
        "filterFreezeAddress": document.getElementById("filterFreezeAddress").checked,
        "filterPause": document.getElementById("filterPause").checked
       })
  })
  .then(response => response.text())
  .then(data => document.getElementById("response").innerHTML = data)
  .catch(error => console.log(error));
}

async function IndexEventsMain() {

  from = ullToHex(0).toUpperCase();
  to = "last"
  try {
    const response = await fetch(serverurl+"/IndexEvents", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "from": from, 
                            "to": to,
                            "indexType": "general",
                            "filterTransactions": document.getElementById("filterTransactions").checked,
                            "filterBalances": document.getElementById("filterBalances").checked,
                            "filterApproval": document.getElementById("filterApproval").checked,
                            "filterSupply": document.getElementById("filterSupply").checked,
                            "filterFreezeAddress": document.getElementById("filterFreezeAddress").checked,
                            "filterPause": document.getElementById("filterPause").checked
                           })
  })

  var data = await response.json()

  await loadtable(data)

} catch (error) {
    console.log("error ",error);
  }

}

async function IndexEventsAddressMain() {

  from = ullToHex(0).toUpperCase();
  to = "last"

  var indexAddress = document.getElementById("Address").textContent
  
  try {
    const response = await fetch(serverurl+"/IndexEvents", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  "from": from, 
                            "to": to,
                            "indexType": indexAddress,
                            "filterTransactions": document.getElementById("filterTransactions").checked,
                            "filterBalances": document.getElementById("filterBalances").checked,
                            "filterApproval": document.getElementById("filterApproval").checked,
                            "filterSupply": document.getElementById("filterSupply").checked,
                            "filterFreezeAddress": document.getElementById("filterFreezeAddress").checked,
                            "filterPause": document.getElementById("filterPause").checked
                           })
  })

  var data = await response.json()

  await loadtable(data)

} catch (error) {
    console.log("error ",error);
  }

}

function IndexAddress() {
  Address = document.getElementById('IndexAddress').value;
  console.log(Address)
  window.open(serverurl+"/AddressIndexing/"+Address, '_blank');
}

async function retrieveinfo(){

  try {
    const response = await fetch(serverurl+"/IndexEvents", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  
                           })
  })

  var data = await response.json()


} catch (error) {
    console.log("error ",error);
  }

}



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

}




