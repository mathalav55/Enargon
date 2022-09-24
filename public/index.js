var MODE = "day";
var ROW2 = document.querySelectorAll(".row")[1];
let years = ["2021", "2022"];
let months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
let body = {year: 2021,month: 0,week: undefined,day: 1,};
var monthPicker = document.querySelector("#month");
var weekPicker = document.querySelector("#week");
var datePicker = document.querySelector("#date");
var yearPicker = document.querySelector("#year");
var getBtn = document.querySelector("#get-data");
var prodElement = document.getElementById("productionChart");
var disElement = document.getElementById("dispatchChart");
var bulkDomChartEle = document.getElementById("bulkDomChart");
var bulkNdChartEle = document.getElementById("bulkNdChart");
var consumeElement = document.getElementById("consumeChart");
var reciptChart = document.getElementById("reciptChart");
var prodChart, disChart, bulkDomChart,bulkNdChart,consumeChart, reciptChart;
// chart updation functions


// charts data
function productionChart(data) {
  const labels = [];
  data.forEach((item) => {
    labels.push(item.type);
  });
  //colors
  prodChart.data.datasets[0].data = data;
  prodChart.data.datasets[0].backgroundColor = getColors(2)[0];
  prodChart.data.datasets[1].data = data;
  prodChart.data.datasets[1].backgroundColor = getColors(2)[1];
  prodChart.update();
}
function dispatchChart(data) {
  const labels2 = [];
  data.forEach((item) => {
    labels2.push(item.type);
  });
  disChart.data.datasets[0].data = data;
  disChart.data.datasets[1].data = data;
  disChart.data.datasets[0].backgroundColor = getColors(2)[0];
  disChart.data.datasets[1].backgroundColor = getColors(2)[1];
  disChart.update();
} 
function getBulkDomChart(data){
  bulkDomChart.reset()
  var labels = [];
  data.forEach((item) => {
    labels.push(item.x);
  });
  var values = [];
  data.forEach((item) => {
    values.push(item.y);
  });
  var colors = getColors(data.length);
  console.log('in bulk function',data,labels)
  bulkDomChart.data.labels = labels;
  bulkDomChart.data.datasets[0].data = values;
  bulkDomChart.data.datasets[0].backgroundColor = colors;
  bulkDomChart.update();
}
function getBulkNdChart(data){
  bulkNdChart.reset()
  var labels = [];
  data.forEach((item) => {
    labels.push(item.x);
  });
  var values = [];
  data.forEach((item) => {
    values.push(item.y);
  });
  var colors = getColors(data.length);
  console.log('in bulk function',data,labels)
  bulkNdChart.data.labels = labels;
  bulkNdChart.data.datasets[0].data = values;
  bulkNdChart.data.datasets[0].backgroundColor = colors;
  bulkNdChart.update();
}
function getConsumeChart(data){
  consumeChart.reset()
  var labels = [];
  data.forEach((item) => {
    labels.push(item.x);
  });
  var values = [];
  data.forEach((item) => {
    values.push(item.y);
  });
  console.log('in consume function',data,labels,values);
  consumeChart.options.plugins.title.text = "Consumables Chart";
  consumeChart.data.labels = labels;
  consumeChart.data.datasets[0].data = values;
  consumeChart.data.datasets[0].backgroundColor = getColors(values.length);
  consumeChart.update();
}
function getReciptChart(data) {
    reciptChart.reset();
    var labels = [];
    data.forEach((item) => {
      labels.push(item.x);
    });
    var values = [];
    data.forEach((item) => {
      values.push(item.y);
    });
    console.log("recipt function:",data,labels);
    reciptChart.options.plugins.title.text = "Bulk Recipts Chart";
    reciptChart.data.labels = labels;
    reciptChart.data.datasets[0].data = values;
    reciptChart.data.datasets[0].backgroundColor = getColors(values.length);
    reciptChart.update();
}
function changeMode(ele) {
  MODE = ele.value;
  //console.log(ele.value);
  //filter req involved in mode change
  //$$$$$$--changing filters according to mode--$$$$$$
  //default - mode month
  //remove all shows
  var container = document.querySelector(".values");
  container.querySelectorAll(".value").forEach((el) => {
    if (el.classList.contains("show")) {
      el.classList.remove("show");
    }
  });
  //if month show year and month
  if (MODE == "month") {
    monthPicker.classList.add("show");
    yearPicker.classList.add("show");
  }
  //if week show year month and week
  if (MODE == "week") {
    yearPicker.classList.add("show");
    monthPicker.classList.add("show");
    weekPicker.classList.add("show");
  }
  //if day show datepciker only
  if (MODE == "day") {
    datePicker.classList.add("show");
  }
  // $$$$--display charts as per mode--$$$$
  //show 4 charts
  if (MODE == "month" || MODE == "week") {
    //hide bulk chart
    //console.log((document.querySelector(".bulkchart").style = "display:none"));
    //make row adjustments
    ROW2.querySelectorAll(".chart").forEach((row) => {
      row.style.width = "45%";
    });
  } else {
    //show 5 charts
    //show bulk chart - make it into pie
    //console.log((document.querySelector(".bulkchart").style = "display:block"));
    ROW2.querySelectorAll(".chart").forEach((row) => {
      row.style.width = "30%";
    });
  }
  chartReset();
}
//initialize fields
function initFields() {
  //years
  var finalString = "";
  var option;
  years.forEach((year) => {
    option = `<option value=${year}>${year}</option>`;
    finalString += option;
  });
  yearPicker.innerHTML = finalString;
  yearPicker.addEventListener("change", (el) => {
    body.year = el.target.value;
    setWeekDates();
  });
  //months
  finalString = "";
  for (var i = 0; i < months.length; i++) {
    option = `<option value=${i}>${months[i]}</option>`;
    finalString += option;
  }
  monthPicker.innerHTML = finalString;
  monthPicker.addEventListener("change", (el) => {
    body.month = el.target.value;
    //console.log(el);
    setWeekDates();
  });
  //date
  datePicker.value = "2021-04-02";
}
function getWeekDates() {
  console.log(body);
  let weeks = [],
    firstDate = new Date(body.year, body.month, 1);
    lastDate = new Date(body.year, parseInt(body.month) + 1, 0);
    numDays = lastDate.getDate();
  let start = 1;
  let end = endFirstWeek(firstDate, 1);
  while (start < numDays) {
    weeks.push({ start: start, end: end });
    start = end + 1;
    end = end + 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
      end = numDays;
    }
  }
  //console.log(weeks);
  return weeks;
}
function endFirstWeek(firstDate, firstDay) {
  //console.log(firstDate);
  //console.log(firstDay);
  if (firstDate.getDay() < firstDay) {
    return firstDay - firstDate.getDay();
  } else {
    return 7 - firstDate.getDay() + firstDay;
  }
}
function setWeekDates() {
  //console.log(body);
  var weeks = getWeekDates();
  var weekElement = document.getElementById("week");
  var option,
    finalString = "";
  var startDay, endDay;
  for (var i = 0; i < weeks.length; i++) {
    startDay = new Date(body.year, body.month, weeks[i].start, 5, 30);
    endDay = new Date(body.year, body.month, weeks[i].end, 5, 30);
    option = `<option value=${i}>${startDay.toDateString()} - ${endDay.toDateString()}</option>`;
    finalString += option;
  }
  weekElement.innerHTML = finalString;
}

initFields();
chartInit();
setWeekDates();
//get details
function getDetails() {
  body.year = yearPicker.value;
  body.month = monthPicker.value;
  body.week = weekPicker.value;
  //console.log(MODE);
  if (MODE == "month") {
    body.week = undefined;
    body.day = undefined;
  } else if (MODE == "week") {
    body.day = undefined;
  } else {
    var date = new Date(datePicker.value);
    //console.log(date);
    body.year = date.getFullYear();
    body.month = date.getMonth();
    body.day = date.getDate();
    body.week = undefined;
  }
  //call api and update charts
  fetchData();
}
getBtn.addEventListener("click", getDetails);
//charts initialization
function chartInit() {
  var bulkCfgDom = { labels: ["one", "two", "three"], type: "pie", data: { labels: ["one", "two", "three"], datasets: [ { label: "Dataset 1", data: [10, 30, 40], backgroundColor: [], }, ], }, options: { responsive: true, plugins: { legend: { position: "top", }, title: { display: true, text: "Bulk Domestic", }, }, }, };
  var bulkCfgNd = { labels: ["one", "two", "three"], type: "pie", data: { labels: ["one", "two", "three"], datasets: [ { label: "Dataset 1", data: [10, 30, 40], backgroundColor: [], }, ], }, options: { responsive: true, plugins: { legend: { position: "top", }, title: { display: true, text: "Bulk Non-domestic", }, }, }, }
  var conscfg = { labels: ["one", "two", "three"], type: "doughnut", data: { labels: ["one", "two", "three"], datasets: [ { label: "Dataset 1", data: [10, 30, 40], backgroundColor: [], }, ], }, options: { responsive: true, plugins: { legend: { position: "top", }, title: { display: true, text: "Consumables", }, }, }, };
  var resCfg = { labels: ["one", "two", "three"], type: "pie", data: { labels: ["one", "two", "three"], datasets: [ { label: "Dataset 1", data: [10, 30, 40], backgroundColor: [], }, ], }, options: { responsive: true, plugins: { legend: { position: "top", }, title: { display: true, text: "Bulk Recipts", }, }, }, }
  let prodCfg = { type: "bar", data: { datasets: [ { label: "Global", data: [], parsing: { yAxisKey: "global", xAxisKey: "type", }, backgroundColor: "", }, { label: "Current", data: [], parsing: { yAxisKey: "current", xAxisKey: "type", }, backgroundColor: "", }, ], }, options: { responsive: true,maintainAspectRatio : false, plugins: { legend: { position: "top", }, title: { display: true, text: "Production" }, }, scales: { x: { grid: { display: false } }, } }, };
  let disCfg = { type: "bar", data: { datasets: [ { label: "Global", data: [], parsing: { yAxisKey: "global", xAxisKey: "type", }, backgroundColor: "", }, { label: "Current", data: [], parsing: { yAxisKey: "current", xAxisKey: "type", }, backgroundColor: "", }, ], }, options: { responsive: true,maintainAspectRatio : false, plugins: { legend: { position: "top", }, title: { display: true, text: "Dispatch", }, }, scales: { x: { grid: { display: false } }, } }, };

  prodChart = new Chart(prodElement, prodCfg);
  disChart = new Chart(disElement, disCfg);
  bulkDomChart = new Chart(bulkDomChartEle, bulkCfgDom);
  bulkNdChart = new Chart(bulkNdChartEle, bulkCfgNd);
  consumeChart = new Chart(consumeElement, conscfg);
  reciptChart = new Chart(reciptChart, resCfg);
}
function chartReset(){
  //set all data to initial
  prodChart.data.datasets[0].data = [];
  prodChart.data.datasets[1].data = [];
  disChart.data.datasets[0].data = [];
  disChart.data.datasets[1].data = [];
  bulkDomChart.data.datasets[0].data = [];
  bulkNdChart.data.datasets[0].data = [];
  consumeChart.data.datasets[0].data = [];
  reciptChart.data.datasets[0].data = [];
  //update charts
  prodChart.update()
  disChart.update()
  bulkDomChart.update()
  bulkNdChart.update()
  consumeChart.update()
  reciptChart.update()
}
//fetch data
async function fetchData() {
  let options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  //console.log(options);
  //production and dispatch data
  fetch("/lpg", options)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      if (data.dateLength != undefined || data.length == 0) {
        alert("no production and dispatch data");
        productionChart([]);
        dispatchChart([]);
      } else {
        productionChart(data.res.production);
        dispatchChart(data.res.dispatch);
      }
    })
    .catch((err) => console.log(err));
  //bulk chart
    fetch('/lpg/bulk',options).then(res=>res.json())
    .then(data=>{
      if( data.result != undefined){
        console.log(data)
        if( data.result.length > 0){
          //domestic chart
          getBulkDomChart([data.result[0],data.result[2]]);
          //non domestic chart
          getBulkNdChart([data.result[1],data.result[3]])
        }
        else{
          getBulkDomChart([]);
          getBulkNdChart([]);
          alert('no bulk data data')
        }
      }
      else{
        getBulkDomChart([]);
        getBulkNdChart([]);
        alert('no bulk data data');
      }
    });
    //consume chart
    fetch('/lpg/consume',options).then(res=>res.json())
    .then(data=>{
      // console.log(data)  
      if( data.result != undefined){
        if( data.result.length > 0)
          getConsumeChart(data.result);
        else{
          getConsumeChart([]);
          alert('no consume data')
        }
      }
      else{
        alert('no consume data');
        getConsumeChart([]);
      }
    })
    //recipt chart
    fetch('/lpg/recipt',options).then(res=>res.json())
    .then(data=>{
      // console.log(data)  
      if( data.result != undefined){
        if( data.result.length > 0)
          getReciptChart(data.result);
        else{
          alert('no recipt data')
          getReciptChart([]);
        }
      }
      else{
        alert('no recipt data');
        getReciptChart([]);
      }
    }) 
}//fetch data

//color generator
function getColors(n){
  var colors = []
  var hue = 16;
  var saturation = 95;
  var lightness = 50;
  for(var i = 0; i < n ; i++){
    colors.push(`hsl(${hue},${saturation}%,${lightness}%)`);
    hue += 10;
  }
  //console.log(colors);
  return colors;
}
