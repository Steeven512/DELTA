var serverurl = window.location.origin;
var tabIndex = 0;
var tabSizeElements=30
var lastTab = 1
var elementsInDb = 0;

numberOfElementsIndexed = true;

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

  if(jsonObject["event"] === "accountBalanceUpdate"){
    return "Address: " +jsonObject["Account"] + " value: "+ sixdecimals(jsonObject["balances"])
  }

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
                            "indexType": "NumberElementsIndex",
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
  const indexValue = "IndexMain";

  let date = new Date();
  date.setTime(date.getTime() + (9999 * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();

  document.cookie = networksValue +indexValue+ "=" + elementsInDb + ";" + expires + ";path=/";

  }  catch (error) {
    console.log("error ",error);
  }

}

async function getCookieIndexNumber(){

  const networksValue = document.getElementById("Networks").value;
  const indexValue = "IndexMain";
  const dbElementsCookie = (document.cookie.match('(^|;)\\s*' + networksValue+indexValue + '\\s*=\\s*([^;]+)') || [])[2] || null

  if(dbElementsCookie){
    elementsInDb = dbElementsCookie
    lastTab= elementsInDb/tabSizeElements
    document.getElementById("tabNumber").textContent = parseInt(tabIndex)+1+"-"+parseInt(lastTab+1)
  } else {
    document.getElementById("tabNumber").textContent = parseInt(tabIndex)+1+" -"+" ...indexing "
    GetelementsInDb()
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


async function IndexEventsMain() {

  if(tabIndex == 0){


    from = tabSizeElements
    to = 0
    try {
      const response = await fetch(serverurl+"/IndexEvents", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({  "from": ullToHex(from), 
                              "to": ullToHex(to),
                              "network": document.getElementById("Networks").value,
                              "indexType": "new",
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

}

async function IndexEventsMain2(frame_size, mul_selector) {


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
                            "indexType": "new",
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

async function updateBalance(){

  var indexAddress = document.getElementById("Address").textContent

  try {
    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"request": "AddressBalance", 
                          "network": document.getElementById("Networks").value,
                          "address": indexAddress,
     })
  })

  var data = await response.text()

  balanceUpdate = document.getElementById("balance")
  balanceUpdate.textContent = sixdecimals(data)

  } catch (error) {
    console.log("error ",error);
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


    retrieveinfo()
    loadCharts()
    await IndexEventsMain()
    getCookieIndexNumber()
    




    networkSelectUpdated = true;

    } catch (error) {

    }
  }

}

function IndexAddress() {
  Address = document.getElementById('IndexAddress').value;
  console.log(Address)
  window.open(serverurl+"/AddressIndexing/"+Address, '_blank');
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
    console.log("eth data ", response)

  var data = await response.json()



  let totalSupply = document.getElementById('totalSupply');
  totalSupply.textContent = sixdecimals(data["totalSupply"]);

  let inReserve = document.getElementById('inReserve');
  inReserve.textContent = sixdecimals(data["inReserve"]);

  let inCirculation = document.getElementById('inCirculation');
  inCirculation.textContent = sixdecimals(data["inCirculation"]);

  let networkName = document.getElementById('networkName');
  networkName.textContent = data["networkName"];

  let networkid = document.getElementById('networkid');
  networkid.textContent = data["networkid"];

  let sm_address = document.getElementById('sm_address');
  sm_address.textContent = data["sm_address"];

  let admin = document.getElementById('admin');
  admin.textContent = data["admin"];

  let name = document.getElementById('name');
  name.textContent = data["name"];

  document.getElementById('symbol').textContent = data["symbol"]+""
  document.getElementById('symbol2').textContent = data["symbol"]+"\u2006"
  document.getElementById('symbol3').textContent = data["symbol"]+"\u2006"
  document.getElementById('symbol4').textContent = data["symbol"]+"\u2006"

} catch (error) {
    console.log("error ",error);
  }

}


window.addEventListener('load', function() {

 
  updateNetworkIndexSelect() 
  IndexEventsAddressMain()



});

async function changeViewChart(){

  if(chartDisplayMode == "day"){
    chartDisplayMode = "week"
    document.getElementById("chartViewMode").textContent = "week"
    loadCharts()
    return 
  }

  if(chartDisplayMode == "week"){
    chartDisplayMode = "day"
    document.getElementById("chartViewMode").textContent = "day"
    loadCharts()
    return 
  }

}



//charts


var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var chartDisplayMode = "day"


function getStartOfDayTimestamp(timestampInSeconds) {
  const date = new Date(timestampInSeconds * 1000);

  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return Math.floor(date.getTime() / 1000); 
}

function getStartOfhourTimestamp(timestampInSeconds) {
  const date = new Date(timestampInSeconds * 1000);

  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return Math.floor(date.getTime() / 1000); 

}



async function RetrieveChartWeek(TypeOfElement){

  let timestamp = Math.floor(Date.now() / 1000);
  timestamp = getStartOfDayTimestamp(timestamp)-1
  week = 604800

  try {

    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"request": "ChartInfo",
                          "network": document.getElementById("Networks").value,
                          "typeindexTime": "week",
                          "TypeOfElement": TypeOfElement, 
                          "Fromdate": ullToHex(timestamp), 
                          "to": ullToHex(timestamp-week)
                           })
    })

    var data = await response.json()

    data = [...data].reverse();

    return data
    

} catch (error) {
    console.log("error ",error);    
  }
}

async function RetrieveChartDay(TypeOfElement){

  let timestamp = Math.floor(Date.now() / 1000);
  timestampMinute0 = getStartOfhourTimestamp(timestamp)-1
  day = 86400

  try {

    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"request": "ChartInfo",
                          "network": document.getElementById("Networks").value,
                          "typeindexTime": "day",
                          "TypeOfElement": TypeOfElement, 
                          "Fromdate": ullToHex(timestampMinute0), 
                          "to": ullToHex(getStartOfDayTimestamp(timestampMinute0))
                           })
    })

    var data = await response.json()

    data = [...data].reverse();

    return data;

} catch (error) {
    console.log("error ",error);    
  }
}

async function RetrieveMintedBurnedChartWeek(){

  let timestamp = Math.floor(Date.now() / 1000);
  timestamp = getStartOfDayTimestamp(timestamp)-1
  week = 604800

  try {

    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"request": "ChartInfo",
                          "network": document.getElementById("Networks").value,
                          "typeindexTime": "week",
                          "TypeOfElement": "MintedBurned", 
                          "Fromdate": ullToHex(timestamp), 
                          "to": ullToHex(timestamp-week)
                           })
    })

   
    var data = await response.json()

    return data;





} catch (error) {
    console.log("error ",error);    
  }
}

async function RetrieveMintedBurnedChartDay(){

  let timestamp = Math.floor(Date.now() / 1000);
  timestampMinute0 = getStartOfhourTimestamp(timestamp)-1
  day = 86400

  try {

    const response = await fetch(serverurl+"/api", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"request": "ChartInfo",
                          "network": document.getElementById("Networks").value,
                          "typeindexTime": "day",
                          "TypeOfElement": "MintedBurned", 
                          "Fromdate": ullToHex(timestampMinute0), 
                          "to": ullToHex(getStartOfDayTimestamp(timestampMinute0))
                           })
    })

    var data = await response.json()

    return data;


} catch (error) {
    console.log("error ",error);    
  }
}


async function loadVolumeTransactionsValueChart(){

  if(chartDisplayMode === "week"){

    dataVolumeTransactionsValuechartweek = await RetrieveChartWeek("TransfersValueVolume")
    dataVolumeTransactionsValuechartday = await RetrieveChartDay("TransfersValueVolume")

    const sum = dataVolumeTransactionsValuechartday.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0); 

    dataVolumeTransactionsValuechartweek.shift()
    dataVolumeTransactionsValuechartweek.push(sum)
    chartUpdateVolumeTransactionsValueWeek(dataVolumeTransactionsValuechartweek)


  }

  if(chartDisplayMode === "day"){

    datachartday = await RetrieveChartDay("TransfersValueVolume")
    chartUpdateVolumeTransactionsValueDay(datachartday)

  }

  document.getElementById("loadingIndicator").style.display = "none";
  document.getElementById("VolumeTransactionsValueChart").style.visibility = "visible";

}

async function loadAmountTransfersChart(){

  if(chartDisplayMode === "week"){

    datachartweek = await RetrieveChartWeek("amountTransfers")
    datachartday = await RetrieveChartDay("amountTransfers")

    const sum = datachartday.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0); 

    datachartweek.shift()
    datachartweek.push(sum)
    chartUpdateAmountTransfersWeek(datachartweek)


  }

  if(chartDisplayMode === "day"){

    datachartday = await RetrieveChartDay("amountTransfers")
    chartUpdateAmountTransfersDay(datachartday)


  }

  document.getElementById("loadingIndicator2").style.display = "none";
  document.getElementById("amountTransfersChart").style.visibility = "visible";

}

async function loadAmountMintedBurnedChart(){

  if(chartDisplayMode === "week"){

    var datachartAmountMintedBurnedweek = await RetrieveMintedBurnedChartWeek()

    mintedWeek = datachartAmountMintedBurnedweek[0]
    burnedWeek = datachartAmountMintedBurnedweek[1]
    mintedWeek = [...mintedWeek].reverse();
    burnedWeek = [...burnedWeek].reverse();

    datachartDay = await RetrieveMintedBurnedChartDay()

    mintedDay = datachartDay[0]
    burnedDay = datachartDay[1]
    mintedDay = [...mintedDay].reverse();
    burnedDay = [...burnedDay].reverse();

    const mintedDaySum = mintedDay.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0); 

    const burnedDaySum = burnedDay.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0); 

    mintedWeek.shift()
    mintedWeek.push(mintedDaySum)

    burnedWeek.shift()
    burnedWeek.push(burnedDaySum)

    chartUpdateMintedBurnedWeek(mintedWeek, burnedWeek)

  
  }

  if(chartDisplayMode === "day"){

    var datachartAmountMintedBurnedweek = await RetrieveMintedBurnedChartDay()

    mintedDay = [...datachartAmountMintedBurnedweek[0]].reverse();
    burnedDay = [...datachartAmountMintedBurnedweek[1]].reverse();

    chartUpdateMintedBurnedDay(mintedDay, burnedDay)


  }


  document.getElementById("loadingIndicator3").style.display = "none";
  document.getElementById("MintedBurnedChart").style.visibility = "visible";



}



function arrangeDays(timestamptiming, splitTime){

  let timestamp = Math.floor(Date.now() / 1000)
  let date = new Date(timestamp * 1000)

  var daysarrange = []

  for(i = 0; i< splitTime; i++){

    daysarrange[i]=daysOfWeek[date.getDay()]
    timestamp -= timestamptiming;
    date = new Date(timestamp * 1000);
    
  }

  daysarrange = [...daysarrange].reverse();

  return daysarrange

}

function arrangeHours(numberOfHours) {
  let timestamp = Math.floor(Date.now() / 1000);
  let hoursArrange = [];

  for (let i = 0; i < numberOfHours; i++) {
    let date = new Date(timestamp * 1000);
    let hour = date.getHours();
    const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    hoursArrange[i] = formattedHour;

    timestamp -= 3600;
    date = new Date(timestamp * 1000);
  }

  hoursArrange = [...hoursArrange].reverse();

  return hoursArrange;
}



async function chartUpdateVolumeTransactionsValueWeek(dataChar){

  if (window.VolumeTransactionsValueChart) {
    window.VolumeTransactionsValueChart.destroy();
  }

  if (typeof VolumeTransactionsValueChart !== 'undefined' && VolumeTransactionsValueChart !== null) {
    VolumeTransactionsValueChart.destroy();
  }

  const ctx = document.getElementById('VolumeTransactionsValueChart').getContext('2d');

  window.VolumeTransactionsValueChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: arrangeDays(86400, 7),
          datasets: [{ 
              data: dataChar,
              backgroundColor: "rgba(186, 214, 255, 0.21)", 
              borderColor: "#b0cfff",
              fill: true,
              borderWidth: 1, 
              tension: 0.1,
              pointRadius: 0,          
              pointHoverRadius: 5,     
              pointHitRadius: 10 
          }]
      },
      options: {
          plugins: {
              legend: { display: false },
              tooltip: { 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: { size: 14 },
                  bodyColor: '#b0cfff',
                  bodyFont: { size: 12 },
                  displayColors: true,
                  callbacks: {
                      label: function(context) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(context.parsed.y);
                      }
                  }
              }
          },
          scales: {
              x: { 
                  grid: { display: false },
                  ticks: {
                      color: "rgba(230, 230, 230, 0.95)",
                      font: { size: 12 }
                  }
              },
              y: {
                  grid: { display: true },
                  ticks: {
                      color: "rgb(219, 219, 219)",
                      font: { size: 12 },
                      callback: function(value) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(value);
                      }
                  },
                  beginAtZero: true
              }
          },
          animation: {
              duration: 2000,
              easing: 'easeOutQuart'
          }
      }
  });

}

async function chartUpdateVolumeTransactionsValueDay(dataChar){

  if (window.VolumeTransactionsValueChart) {
    window.VolumeTransactionsValueChart.destroy();
  }

  if (typeof VolumeTransactionsValueChart !== 'undefined' && VolumeTransactionsValueChart !== null) {
    VolumeTransactionsValueChart.destroy();
  }

  const ctx = document.getElementById('VolumeTransactionsValueChart').getContext('2d');

  window.VolumeTransactionsValueChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: arrangeHours(24),
          datasets: [{ 
              data: dataChar,
              backgroundColor: "rgba(186, 214, 255, 0.21)", 
              borderColor: "#b0cfff",
              fill: true,
              borderWidth: 1, 
              tension: 0.1,
              pointRadius: 0,          
              pointHoverRadius: 5,     
              pointHitRadius: 10 
          }]
      },
      options: {
          plugins: {
              legend: { display: false },
              tooltip: { 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: { size: 14 },
                  bodyColor: '#b0cfff',
                  bodyFont: { size: 12 },
                  displayColors: true,
                  callbacks: {
                      label: function(context) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(context.parsed.y);
                      }
                  }
              }
          },
          scales: {
              x: { 
                  grid: { display: false },
                  ticks: {
                      color: "rgba(230, 230, 230, 0.95)",
                      font: { size: 12 }
                  }
              },
              y: {
                  grid: { display: true },
                  ticks: {
                      color: "rgb(219, 219, 219)",
                      font: { size: 12 },
                      callback: function(value) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(value);
                      }
                  },
                  beginAtZero: true
              }
          },
          animation: {
              duration: 2000,
              easing: 'easeOutQuart'
          }
      }
  });

}

async function chartUpdateAmountTransfersWeek(dataChar){

  if (window.amountTransfersChart) {
    window.amountTransfersChart.destroy();
  }

  if (typeof amountTransfersChart !== 'undefined' && amountTransfersChart !== null) {
    amountTransfersChart.destroy();
  }


const ctx = document.getElementById('amountTransfersChart').getContext('2d');

window.amountTransfersChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: arrangeDays(86400, 7),
        datasets: [{ 
            data: dataChar,
            backgroundColor: "rgba(186, 214, 255, 0.21)", 
            borderColor: "#b0cfff",
            fill: true,
            borderWidth: 1, 
            tension: 0.1,
            pointRadius: 0,          
            pointHoverRadius: 5,     
            pointHitRadius: 10 
        }]
    },
    options: {
        plugins: {
            legend: { display: false },
            tooltip: { 
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 14 },
                bodyColor: '#b0cfff',
                bodyFont: { size: 12 },
                displayColors: true,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "rgba(230, 230, 230, 0.95)",
                    font: { size: 12 }
                }
            },
            y: { 
                grid: { display: true },
                ticks: {
                    color: "rgb(219, 219, 219)",
                    font: { size: 12 },
                },
                beginAtZero: true
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    }
});

}

async function chartUpdateAmountTransfersDay(dataChar){

  if (window.amountTransfersChart) {
    window.amountTransfersChart.destroy();
  }

  if (typeof amountTransfersChart !== 'undefined' && amountTransfersChart !== null) {
    amountTransfersChart.destroy();
  }

  const ctx = document.getElementById('amountTransfersChart').getContext('2d');

  window.amountTransfersChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: arrangeHours(24),
          datasets: [{ 
              data: dataChar,
              backgroundColor: "rgba(186, 214, 255, 0.21)", 
              borderColor: "#b0cfff",
              fill: true,
              borderWidth: 1, 
              tension: 0.1,
              pointRadius: 0,          
              pointHoverRadius: 5,     
              pointHitRadius: 10 
          }]
      },
      options: {
          plugins: {
              legend: { display: false },
              tooltip: { 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: { size: 14 },
                  bodyColor: '#b0cfff',
                  bodyFont: { size: 12 },
                  displayColors: true,
                  callbacks: {
  
                  }
              }
          },
          scales: {
              x: { 
                  grid: { display: false },
                  ticks: {
                      color: "rgba(230, 230, 230, 0.95)",
                      font: { size: 12 }
                  }
              },
              y: {
                  grid: { display: true },
                  ticks: {
                      color: "rgb(219, 219, 219)",
                      font: { size: 12 }
                  },
                  beginAtZero: true
              }
          },
          animation: {
              duration: 2000,
              easing: 'easeOutQuart'
          }
      }
  });

}

async function chartUpdateMintedBurnedWeek(dataChartMinted, dataChartburned){

  if (window.MintedBurnedChart) {
    window.MintedBurnedChart.destroy();
  }

  if (typeof MintedBurnedChart !== 'undefined' && MintedBurnedChart !== null) {
    MintedBurnedChart.destroy();
  }

  const ctx = document.getElementById('MintedBurnedChart').getContext('2d');

  window.MintedBurnedChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: arrangeDays(86400, 7),
          datasets: [{ 
              data: dataChartburned,
              backgroundColor: "rgba(255, 195, 111, 0.48)", 
              borderColor: "rgba(255, 184, 19, 0.72)",
              fill: true,
              borderWidth: 1, 
              tension: 0.1,
              borderWidth: 1,
              pointRadius: 0,          
              pointHoverRadius: 5,     
              pointHitRadius: 10 
          }, { 
            data: dataChartMinted,
            backgroundColor:"rgba(113, 244, 235, 0.26)",
            borderColor: "rgba(113, 244, 235, 0.59)",
            fill: true,
            borderWidth: 1, 
            tension: 0.1,
            pointRadius: 0,          
            pointHoverRadius: 5,     
            pointHitRadius: 10 
          }]
      },
      options: {
          plugins: {
              legend: { display: false },
              tooltip: { 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: { size: 14 },
                  bodyColor: '#b0cfff',
                  bodyFont: { size: 12 },
                  displayColors: true,
                  callbacks: {
                      label: function(context) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(context.parsed.y);
                      }
                  }
              }
          },
          scales: {
              x: { 
                  grid: { display: true },
                  ticks: {
                      color: "rgba(230, 230, 230, 0.95)",
                      font: { size: 12 }
                  }
              },
              y: { 
                  grid: { display: true },
                  ticks: {
                      color: "rgb(219, 219, 219)",
                      font: { size: 12 },
                      callback: function(value) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(value);
                      }
                  },
                  beginAtZero: true
              }
          },
          animation: {
              duration: 2000,
              easing: 'easeOutQuart'
          }
      }
  });

}

async function chartUpdateMintedBurnedDay(dataChartMinted, dataChartburned){

  if (window.MintedBurnedChart) {
    window.MintedBurnedChart.destroy();
  }

  if (typeof MintedBurnedChart !== 'undefined' && MintedBurnedChart !== null) {
    MintedBurnedChart.destroy();
  }

  const ctx = document.getElementById('MintedBurnedChart').getContext('2d');

  window.MintedBurnedChart = new Chart(ctx, {
      type: "line",
      data: {
          labels: arrangeHours(24),
          datasets: [{ 
            data: dataChartburned,
            backgroundColor: "rgba(255, 195, 111, 0.48)", 
            borderColor: "rgba(255, 184, 19, 0.72)",
            fill: true,
            borderWidth: 1, 
            tension: 0.1,
            borderWidth: 1,
            pointRadius: 0,          
            pointHoverRadius: 5,     
            pointHitRadius: 10 
        }, { 
          data: dataChartMinted,
          backgroundColor:"rgba(113, 244, 235, 0.26)",
          borderColor: "rgba(113, 244, 235, 0.59)",
          fill: true,
          borderWidth: 1, 
          tension: 0.1,
          pointRadius: 0,          
          pointHoverRadius: 5,     
          pointHitRadius: 10 
        }]
      },
      options: {
          plugins: {
              legend: { display: false },
              tooltip: { 
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: { size: 14 },
                  bodyColor: '#b0cfff',
                  bodyFont: { size: 12 },
                  displayColors: true,
                  callbacks: {
                      label: function(context) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(context.parsed.y);
                      }
                  }
              }
          },
          scales: {
              x: { 
                  grid: { display: false },
                  ticks: {
                      color: "rgba(230, 230, 230, 0.95)",
                      font: { size: 12 }
                  }
              },
              y: {
                  grid: { display: true },
                  ticks: {
                      color: "rgb(219, 219, 219)",
                      font: { size: 12 },
                      callback: function(value) {
                          return document.getElementById('symbol').textContent+"\u2006" + sixdecimals(value);
                      }
                  },
                  beginAtZero: true
              }
          },
          animation: {
              duration: 2000,
              easing: 'easeOutQuart'
          }
      }
  });

}





async function loadCharts(){

  loadVolumeTransactionsValueChart()
  loadAmountTransfersChart()
  loadAmountMintedBurnedChart()

}




var VolumeTransactionsValueChart = new Chart("VolumeTransactionsValueChart", {
  
  type: "line",
  data: {
    labels: arrangeDays(86400, 7),
    datasets: [{ 
      data: [0,0,0,0,0,0,0,0,0,0],
      borderColor: "blue",
      backgroundColor: "#b0cfffc2",
      fill: true,
      borderColor: "#b0cfff", 
      borderWidth: 0, 
    }]
  },
options: {
    legend: {display: false},
    scales: {
      xAxes: [{
        gridLines: {
          display: false 
        }, 
        ticks: {
        fontColor: "rgba(129, 129, 129, 0.81)",
        fontSize: 12,

      }
      }],
      yAxes: [{
        gridLines: {
          display: false // 
        } , 
        ticks: {
        fontColor: "rgba(129, 129, 129, 0.81)", 
        fontSize: 12,
        callback: function(value) {
          return "$" + value;  
        }
      }
      }]
    }
  }
});

var amountTransfersChart = new Chart("amountTransfersChart", {
  
  type: "line",
  data: {
    labels: arrangeDays(86400, 7),
    datasets: [{ 
      data: [0,0,0,0,0,0,0],
      borderColor: "blue",
      backgroundColor: "#b0cfffc2",
      fill: true,
      borderColor: "#b0cfff", 
      borderWidth: 0, 
    }]
  },
options: {
    legend: {display: false},
    scales: {
      xAxes: [{
        gridLines: {
          display: false 
        }, 
        ticks: {
        fontColor: "rgba(129, 129, 129, 0.81)",
        fontSize: 12,

      }
      }],
      yAxes: [{
        gridLines: {
          display: false // 
        } , 
        ticks: {
        fontColor: "rgba(129, 129, 129, 0.81)", 
        fontSize: 12,
      }
      }]
    }
  }
});

var MintedBurnedChart = new Chart("MintedBurnedChart", {
  
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
      data: [0],
      borderColor: "fd7e14",
      backgroundColor: "#fd7e1473",
      fill: true,
      borderWidth: 1, 
    }] ,    data: {
      labels: xValues,
      datasets: [{ 
        data: [666, 777],
        borderColor: "#28a745",
        backgroundColor: "#3f9f5e82",
        fill: true,
        borderWidth: 1, 
      }]
    },

  },
options: {
    legend: {display: false},
    scales: {
      xAxes: [{
        gridLines: {
          display: false 
        }, 
        ticks: {
        fontColor: "#FFF", 
        fontSize: 12,

      }
      }],
      yAxes: [{
        gridLines: {
          display: false 
        } , 
        ticks: {
        fontColor: "#FFF",  
        fontSize: 12,
        callback: function(value) {
          return totalSupply + value; 
        }
      }
      }]
    }
  }
});





//controol tabs

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





