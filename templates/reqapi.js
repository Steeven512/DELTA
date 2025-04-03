var serverurl = window.location.origin;

let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

  const tableBody = document.getElementById('table-body');
  tableBody.appendChild(tr);

}

async function loadtable(araytable){
  clearTable()

  apprendTh()

  trcontrast = false;

  for (let i = 0; i < araytable.length; i++) {
    createTableRow(araytable[i],i,trcontrast);
    if(trcontrast){
      trcontrast = false
    } else {
      trcontrast = true
    }
  }

}

async function IndexEvents(f, t) {

    from = ullToHex(f).toUpperCase();
    to = ullToHex(t).toUpperCase();

    autoIndex=false

    try {
      const response = await fetch(serverurl+"/IndexEvents", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({  "from": from, 
                              "to": to,
                              "network": document.getElementById("Networks").value,
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

    console.log("debug", data)
  
    await loadtable(data)
  
  } catch (error) {
      console.log("error ",error);
  }
}

function ClearIntervals() {

  document.getElementById('fromBl').textContent = ""
  document.getElementById('toBl').textContent = ""

  let fromBl = document.getElementById('fromBl');
  fromBl.value = "";

  let toBl = document.getElementById('toBl');
  toBl.value = "";

  switchButtomintervals()

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

  let maxinterval = 50
  let fromBl = document.getElementById('fromBl').value
  let toBl = document.getElementById('toBl').value

  if(toBl <fromBl ){
    alert("input error: toBl < fromBl")
  }
  if(toBl-fromBl>maxinterval){
    alert("max interval exceeded",maxinterval )
  }

  IndexEvents(fromBl, toBl)

  await switchButtomClear()



}

autoIndex = true;

async function IndexEventsMain() {

  if(autoIndex){

    await updateNetworkIndexSelect() 
    await retrieveinfo()

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
                              "network": document.getElementById("Networks").value,
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

async function IndexEventsAddressMain() {

  await updateNetworkIndexSelect() 
  await retrieveinfoIndexingSection()
  GetBalanceAddress()

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
      "network": document.getElementById("Networks").value,
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

    RetrieveVolumeTransactionsValueChart()
    RetrieveMintedBurnedChart()
    RetrieveAmountTransfersChart()

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

  let symbol = document.getElementById('symbol');
  symbol.textContent = data["symbol"];

  console.log(data)


} catch (error) {
    console.log("error ",error);
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

  let totalSupply = document.getElementById('totalSupply');
  totalSupply.textContent = "$"+sixdecimals(data["totalSupply"]);

  let inReserve = document.getElementById('inReserve');
  inReserve.textContent = "$"+sixdecimals(data["inReserve"]);

  let inCirculation = document.getElementById('inCirculation');
  inCirculation.textContent = "$"+sixdecimals(data["inCirculation"]);

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

  let symbol = document.getElementById('symbol');
  symbol.textContent = data["symbol"];

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
      document.getElementById('balance').textContent = "$"+sixdecimals(data)
      
  } catch (error) {
      console.log("error ",error);
  }

}

window.addEventListener('load', function() {

  IndexEventsMain()
  IndexEventsAddressMain()

});

//charts
async function RetrieveVolumeTransactionsValueChart(){

  let timestamp = Math.floor(Date.now() / 1000);
  let date = new Date(timestamp * 1000);


  console.log("actual timestamp ", date.getDay());

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
                          "TypeOfElement": "TransfersValueVolume", 
                          "Fromdate": ullToHex(timestamp), 
                          "to": ullToHex(timestamp-week)
                           })
    })

    var data = await response.json()

    data = [...data].reverse();

    chartUpdateVolumeTransactionsValue(data)

} catch (error) {
    console.log("error ",error);    
  }
}

async function RetrieveMintedBurnedChart(){

  let timestamp = Math.floor(Date.now() / 1000);
  let date = new Date(timestamp * 1000);

  console.log("actual timestamp ", date.getDay());

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

    console.log(data)

    minted = data[0]
    burned = data[1]

    minted = [...minted].reverse();
    burned = [...burned].reverse();

    chartUpdateMintedBurned(minted, burned)



} catch (error) {
    console.log("error ",error);    
  }
}

async function RetrieveAmountTransfersChart(){

  let timestamp = Math.floor(Date.now() / 1000);
  let date = new Date(timestamp * 1000);

  console.log("actual timestamp ", date.getDay());

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
                          "TypeOfElement": "amountTransfers", 
                          "Fromdate": ullToHex(timestamp), 
                          "to": ullToHex(timestamp-week)
                           })
    })

   
    var data = await response.json()

    console.log("amount transfers data ", data)

    data = [...data].reverse();

    chartUpdateAmountTransfers(data)



} catch (error) {
    console.log("error ",error);    
  }
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

async function chartUpdateAmountTransfers(dataChar){

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

async function chartUpdateVolumeTransactionsValue(dataChar){

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
                        return '$' + context.parsed.y;
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
                        return "$" + value;
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

async function chartUpdateMintedBurned(dataChartMinted, dataChartburned){

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
              backgroundColor: "rgba(255, 149, 0, 0.46)", 
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
            backgroundColor: "rgba(73, 191, 110, 0.51)",
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
                          return '$' + context.parsed.y;
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
                          return "$" + value;
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

var amountTransfersChart = new Chart("amountTransfersChart", {
  
  type: "line",
  data: {
    labels: arrangeDays(86400, 7),
    datasets: [{ 
      data: [300,700,aa,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      backgroundColor: "#b0cfffc2",
      fill: true,
      borderColor: "#b0cfff", 
      borderWidth: 1, 
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

var VolumeTransactionsValueChart = new Chart("VolumeTransactionsValueChart", {
  
  type: "line",
  data: {
    labels: arrangeDays(86400, 7),
    datasets: [{ 
      data: [300,700,aa,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      backgroundColor: "#b0cfffc2",
      fill: true,
      borderColor: "#b0cfff", 
      borderWidth: 1, 
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
          return "$" + value; 
        }
      }
      }]
    }
  }
});




