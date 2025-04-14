var serverurl = window.location.origin;
var tabIndex = 0;
var tabSizeElements=30
var lastTab = 0
var autoIndex = true
var elementsInDb = 0;

numberOfElementsIndexed = false;

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
  
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return integerPart + '.' + decimalPart;
  }
  
  function ullToHex(number) {
  
    if (typeof number !== 'number' || number < 0 || number > 18446744073709551615) {
      return "Invalid input"; // Or throw an error, depending on your needs
    }
    const hexString = number.toString(16).toUpperCase();
    return hexString.padStart(16, '0');
    
  }
  
  function clearTable(){
    const table = document.getElementById('tableEvents');
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    table.appendChild(tableBody); 
  }
  
  function eventData(jsonObject){
  
    if(jsonObject["event"] === "Transfer"){
      return "from: " +jsonObject["from"] + "   to: "+ jsonObject["to"] + " value: "+ sixdecimals(jsonObject["value"])
    }
  
    if(jsonObject["event"] === "Approval"){
      return "owner: " +jsonObject["owner"] + " spender: "+ jsonObject["spender"] + " value: "+ sixdecimals(jsonObject["value"])
    }
  
    if(jsonObject["event"] === "FrozenAddressWiped"){
      return "Address: " +jsonObject["addr"] 
    }
  
    if(jsonObject["event"] === "FreezeAddress"){
      return "Address: " +jsonObject["addr"] 
    }
  
    if(jsonObject["event"] === "UnfreezeAddress"){
      return "Address: " +jsonObject["addr"] 
    }
  
    if(jsonObject["event"] === "SupplyDecreased"){
      return "Address: " +jsonObject["from"] +" value: "+sixdecimals(jsonObject["value"])
    }
  
    if(jsonObject["event"] === "SupplyIncreased"){
      return "Address: " +jsonObject["to"] +" value: "+sixdecimals(jsonObject["value"])
    }
  
  }
  
  function createTableRow(logElements, number, trcontrast) {
  
    const tr = document.createElement('tr');
    if(trcontrast){
      tr.className = 'trContrast';
    }
  
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
    td5.classList.add('tableEventsdata');
  
    //td0.textContent = number;
    td1.textContent = jsonObject["blockNumber"];
    td2.textContent = jsonObject["transactionIndex"];
    td3.textContent = jsonObject["logIndex"];
    td4.textContent = jsonObject["event"];
    td5.textContent = eventData(jsonObject)
  
    //tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
  
    const tableBody = document.getElementById('table-body');
    tableBody.appendChild(tr);
  }
  
  async function GetelementsInDb(){

    try {
      const response = await fetch(serverurl+"/IndexEvents", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({  "from": ullToHex(0), 
                              "to": ullToHex(0),
                              "network": document.getElementById("Networks").value,
                              "indexType": "NumberElementsAccount",
                              "Address": document.getElementById("Address").textContent,
                              "filterTransactions": document.getElementById("filterTransactions").checked,
                              "filterApproval": document.getElementById("filterApproval").checked,
                              "filterSupply": document.getElementById("filterSupply").checked,
                              "filterFreezeAddress": document.getElementById("filterFreezeAddress").checked,
                              "filterPause": document.getElementById("filterPause").checked
                            })
    })
  
    var data = await response.text()
  
    elementsInDb = parseInt(data,16)
  
    lastTab= elementsInDb/tabSizeElements

    document.getElementById("tabNumber").textContent = parseInt(tabIndex)+1+"-"+parseInt(lastTab+1)

    const networksValue = document.getElementById("Networks").value;
    const indexValue = document.getElementById("Address").textContent;
  
    let date = new Date();
    date.setTime(date.getTime() + (9999 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    document.cookie = networksValue +indexValue+ "=" + elementsInDb + ";" + expires + ";path=/";


  
    }  catch (error) {
      console.log("error ",error);
    }
  
  }

  function getCookieIndexNumber(){

    const networksValue = document.getElementById("Networks").value;
    const indexValue = document.getElementById("Address").textContent;
    const dbElementsCookie = (document.cookie.match('(^|;)\\s*' + networksValue+indexValue + '\\s*=\\s*([^;]+)') || [])[2] || null

    if(dbElementsCookie){
      elementsInDb = dbElementsCookie
      lastTab= elementsInDb/tabSizeElements
      document.getElementById("tabNumber").textContent = parseInt(tabIndex)+1+"-"+parseInt(lastTab+1)
    } else {
      document.getElementById("tabNumber").textContent = parseInt(tabIndex)+1+"-"+" ...indexing "
    }

  }
  
  function apprendTh(){
  
    logElements = ['{"blockNumber" : "blockNumber", "transactionIndex" : "transactionIndex" , "logIndex" : "logIndex", "event" : "event"}'];
  
    let jsonObject = JSON.parse(logElements);
  
    tr = document.createElement('tr');
    //const th0 = document.createElement('th');
    const th1 = document.createElement('th');
    const th2 = document.createElement('th');
    const th3 = document.createElement('th');
    const th4 = document.createElement('th');
  
    //th0.classList.add('tableEventsLeft');
    th1.classList.add('tableEventsCenter');
    th2.classList.add('tableEventsCenter');
    th3.classList.add('tableEventsCenter');
    th4.classList.add('tableEventsCenter');
  
    //th0.textContent = "N.";
    th1.textContent = jsonObject["blockNumber"];
    th2.textContent = jsonObject["transactionIndex"];
    th3.textContent = jsonObject["logIndex"];
    th4.textContent = jsonObject["event"];
  
    //tr.appendChild(th0);
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
  
    const thControls = document.createElement('th');
    thControls.classList.add('controls-right'); 
    
    const botonPrev = document.createElement('button');
    botonPrev.classList.add('buttonsearch');
    botonPrev.textContent = 'Prev';
    thControls.appendChild(botonPrev);
    botonPrev.addEventListener('click', function() {
      prevTab();
    });
    
    const spanTexto = document.createElement('span');
    spanTexto.textContent = document.createTextNode(parseInt(tabIndex)+1+"-"+parseInt(lastTab+1)).textContent;
    
    spanTexto.id = 'tabNumber';
  
  
  
    thControls.appendChild(spanTexto );
    
    const botonNext = document.createElement('button');
    botonNext.classList.add('buttonsearch');
    botonNext.textContent = 'Next';
    thControls.appendChild(botonNext);
    botonNext.addEventListener('click', function() {
      nextTab();
    });
  
    tr.appendChild(thControls);
  
  
  
  
    const tableBody = document.getElementById('table-body');
    tableBody.appendChild(tr);
  
  }
  
  async function loadtable(araytable){

    clearTable()
    apprendTh()
  
    lastTab= elementsInDb/tabSizeElements
  
    trcontrast = false;
  
    for (let i = 0; i < araytable.length; i++) {
      createTableRow(araytable[i],i,trcontrast);
      if(trcontrast){
        trcontrast = false
      } else {
        trcontrast = true
      }
    }
  
    document.getElementById("tabNumber").textContent = parseInt(tabIndex)+1+"-"+parseInt(lastTab+1)

  
  
  }
  
  function ClearIntervals() {
  
    document.getElementById('toBl').textContent = ""
  
    let toBl = document.getElementById('toBl');
    toBl.value = "";
  
    switchButtomintervals()
    tabIndex = 0
  
    autoIndex = true
  
  
  }
  
  async function switchButtomClear() {

    let buttonToRemplace = document.getElementById('indexIntervalsButton')
    let divPadre = buttonToRemplace.parentNode
    divPadre.removeChild(buttonToRemplace)
    let ClearButtom = document.createElement('button')
    ClearButtom.id = 'indexIntervalsButton'
    ClearButtom.className = 'buttonsearch'
    ClearButtom.textContent = 'Clear'
    ClearButtom.onclick = function() {
      ClearIntervals()
  };
    divPadre.appendChild(ClearButtom)
  
  }
  
  function switchButtomintervals() {
  
    let buttonToRemplace = document.getElementById('indexIntervalsButton')
    let divPadre = buttonToRemplace.parentNode
    divPadre.removeChild(buttonToRemplace)
    let ClearButtom = document.createElement('button')
    ClearButtom.id = 'indexIntervalsButton'
    ClearButtom.className = 'buttonsearch'
    ClearButtom.textContent = 'Search'
    ClearButtom.onclick = function() {
      performIndexEventsInIntervals()
    };
    divPadre.appendChild(ClearButtom)
  
  }
  
  async function performIndexEventsInIntervals(){
  
    let toBl = parseInt(document.getElementById('toBl').value)
  
    if(toBl <1 ){
      alert("error: query < 1")
      return
    }
    if(toBl>lastTab+1){
      alert("error: query >",lastTab )
      return
    }
  
    IndexEventsMain2(tabSizeElements, toBl-1)
  
  
  }
  
  autoIndex = true;




  async function IndexEventsAddressMain() {


    if(tabIndex == 0){

        from = tabIndex
        to = tabSizeElements

        try {
        const response = await fetch(serverurl+"/IndexEvents", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "from": ullToHex(from), 
                              "to": ullToHex(to),
                              "network": document.getElementById("Networks").value,
                                "indexType": document.getElementById("Address").textContent,
                                "filterTransactions": document.getElementById("filterTransactions").checked,
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


  
  }

  networkSelectUpdated = false;

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

    document.getElementById('Networks').value = (document.cookie.match('(^|;)\\s*' + "networkSet" + '\\s*=\\s*([^;]+)') || [])[2] || null


    GetBalanceAddress()
    retrieveinfo() 

    await IndexEventsAddressMain()

    getCookieIndexNumber()
    await GetelementsInDb()


    networkSelectUpdated = true;

    } catch (error) {

    }
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
  

  
    let networkName = document.getElementById('networkName');
    networkName.textContent = data["networkName"];
  
    let networkid = document.getElementById('networkid');
    networkid.textContent = data["networkid"];
  
    let name = document.getElementById('name');
    name.textContent = data["name"];
  
    document.getElementById('symbol').textContent = data["symbol"]+""
    document.getElementById('symbol2').textContent = data["symbol"]+"\u2006"

  
  } catch (error) {
      console.log("error ",error);
    }
  
  }

function IndexAddress() {
    Address = document.getElementById('IndexAddress').value;
    console.log(Address)
    window.open(serverurl+"/AddressIndexing/"+Address, '_blank');
  }

async function IndexEvents2(frame_size, mul_selector) {

    try {
      const response = await fetch(serverurl+"/IndexEvents", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({  "from": ullToHex(frame_size), 
                              "to": ullToHex(parseInt(mul_selector)),
                              "network": document.getElementById("Networks").value,
                              "indexType": document.getElementById("Address").textContent,
                              "filterTransactions": document.getElementById("filterTransactions").checked,
                              "filterApproval": document.getElementById("filterApproval").checked,
                              "filterSupply": document.getElementById("filterSupply").checked,
                              "filterFreezeAddress": document.getElementById("filterFreezeAddress").checked,
                              "filterPause": document.getElementById("filterPause").checked
                            })
    })
  
    var data = await response.json()
  
    await loadtable(data)

  
    }  catch (error) {
      console.log("error ",error);
    }
  
  }

async function retrieveinfoIndexingSection(){

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
  
    let networkName = document.getElementById('networkName');
    networkName.textContent = data["networkName"];
  
    let networkid = document.getElementById('networkid');
    networkid.textContent = data["networkid"];
  
    let name = document.getElementById('name');
    name.textContent = data["name"];
  
    document.getElementById('symbol').textContent = data["symbol"]

    
    
  } catch (error) {
      console.log("error ",error);
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
        document.getElementById('balance').textContent = sixdecimals(data)
        
    } catch (error) {
        console.log("error ",error);
    }
  
}

window.addEventListener('load', function() {

    updateNetworkIndexSelect() 



  });

  

function nextTab(){

    if(tabIndex<lastTab){
  
      IndexEventsMain2(tabSizeElements ,tabIndex+1)
      document.getElementById("tabNumber").textContent = parseInt(++tabIndex)+1+"-"+parseInt(lastTab+1)
    }
  
    if(tabIndex<1){
      autoIndex = true
    }
  
  
  }
function prevTab(){
  
    if(tabIndex>0){
      autoIndex = false
      IndexEventsMain2(tabSizeElements ,tabIndex-1)
      document.getElementById("tabNumber").textContent = parseInt(--tabIndex)+1+"-"+parseInt(lastTab+1)
    }
  
  }