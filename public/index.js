let selectYearEle = document.getElementById("SelectYear");
let selectMonthsEle = document.getElementById("SelectMonth");
let DayList = document.getElementById("SelectDay");
var WeekList = document.getElementById("SelectWeek");
let url = "/lpg";
var prodElement = document.getElementById("productionChart");
var disElement = document.getElementById("dispatchChart");
var bulkChartEle = document.getElementById("bulkChart");
var consumeElement = document.getElementById("consumeChart");
let pieConfig ={
  labels : ['one','two',"three"],
  type: 'pie',
  data:  {
    labels : ['one','two','three'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10,30,40],
        backgroundColor: [ '#b0f0ac','#f0f','#ff0'],
      }
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Pie Chart'
      }
    }
  },
}
let barCfg = {
  type: "bar",
    data: {
      datasets: [
        {
          label: "Global",
          data: [],
          parsing: {
            yAxisKey: "global",
            xAxisKey: "type",
          },
          backgroundColor: "#f00",
        },
        {
          label: "Current",
          data: [],
          parsing: {
            yAxisKey: "current",
            xAxisKey: "type",
          },
          backgroundColor: "#f0f",
        },
      ],
    },
}

var prodChart = new Chart(prodElement,barCfg);
var disChart = new Chart(disElement,barCfg);
var bulkChart = new Chart(bulkChartEle,pieConfig);
var consumeChart = new Chart(consumeElement,pieConfig)
let Years = ["2021", "2022"];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
for (let i = 0; i < months.length; i++) {
  let optionEle = document.createElement("option");
  optionEle.value = i;
  optionEle.innerHTML = months[i];
  selectMonthsEle.appendChild(optionEle);
}

// below variable are used for getting the value in json format in obj

let yearval;
let monthval;
let weekval;
let dayval;
// getting the year value for fetching number of days
let SelectionofDaysYearValue;
let yearValueForGettingWeek;
function YearValue() {
  let selectedValue = selectYearEle.options[selectYearEle.selectedIndex].text;
  year = selectedValue;
  SelectionofDaysYearValue = selectedValue;
  yearval = selectedValue;
  console.log(selectedValue);
  yearValueForGettingWeek = selectedValue;
}

let min = 1;
let MonthValueForGettingWeek;
function MonthValue() {
  // getting the month value ex: jan : 1,feb: 2....

  let max;
  let selectedValue =
    selectMonthsEle.options[selectMonthsEle.selectedIndex].value;
  // console.log(Number(selectedValue) + 1);
  monthval = selectedValue;
  monthval = selectedValue;
  // console.log(SelectionofDaysYearValue)
  let yearNumber = Number(SelectionofDaysYearValue);
  let monthNumber = Number(selectedValue) + 1;
  MonthValueForGettingWeek = monthNumber;
  console.log(yearNumber, monthNumber);
  let x = new Date(yearNumber, monthNumber, 0).getDate();
  // console.log(x)
  max = x;

  // getting number of days in a month loop ...

  var final = "";
  for (let i = min; i <= max; i++) {
    let dayOption = `<option value="${i}">${i}</option>`;
    final += dayOption;
  }
  DayList.innerHTML = final;

  WeekValue();
}

function WeekValue() {
  function endFirstWeek(firstDate, firstDay) {
    if (!firstDay) {
      return 7 - firstDate.getDay();
    }
    if (firstDate.getDay() < firstDay) {
      return firstDay - firstDate.getDay();
    } else {
      return 7 - firstDate.getDay() + firstDay;
    }
  }

  function getWeeksStartAndEndInMonth(month, year) {
    let weeks = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate();

    let start = 1;
    let end = endFirstWeek(firstDate, 1);
    while (start <= numDays) {
      weeks.push({ start: start, end: end });
      start = end + 1;
      end = end + 7;
      end = start === 1 && end === 8 ? 1 : end;
      if (end > numDays) {
        end = numDays;
      }
    }
    return weeks;
  }
  let weeksList = getWeeksStartAndEndInMonth(
    MonthValueForGettingWeek - 1,
    yearValueForGettingWeek
  );
  console.log(weeksList);
  let startDay, endDay;
  const option = document.createElement("option");
  var final = "";
  for (let i = 0; i < weeksList.length; i++) {
    startDay = new Date(
      yearValueForGettingWeek,
      MonthValueForGettingWeek - 1,
      weeksList[i].start
    );
    endDay = new Date(
      yearValueForGettingWeek,
      MonthValueForGettingWeek - 1,
      weeksList[i].end
    );
    option.textContent = `${i+1}st Week  From [${startDay.toLocaleDateString()}] To [${endDay.toLocaleDateString()}]`;
    let weekOption = `<option value="${i}">${option.textContent}</option>`;
    // option.setAttribute("id");
    final += weekOption;
    // WeekList.appendChild(option);
  }
  WeekList.innerHTML = final;

  let selectedValue = WeekList.options[WeekList.selectedIndex].value;
  week = selectedValue;
  weekval = selectedValue;
  console.log(selectedValue);
}

function DayValue() {
  let selectedValue = DayList.options[DayList.selectedIndex].value;
  day = selectedValue;
  dayval = selectedValue;
  console.log(selectedValue);
}

function monthBtn() {
  let year = document.getElementById("YearSection");
  let month = document.getElementById("monthsSection");
  let week = document.getElementById("WeeksSection");
  let day = document.getElementById("DaysSection");
  let conatiner = document.getElementById("allButtonsContainer");
  week.style.display = "none";
  day.style.display = "none";
  year.style.display = "block";
  month.style.display = "block";
  conatiner.style.display = "block";
}

function weekBtn() {
  monthBtn();
  let week = document.getElementById("WeeksSection");
  let day = document.getElementById("DaysSection");
  day.style.display = "none";
  week.style.display = "block";
}
function dayBtn() {
  weekBtn();
  let day = document.getElementById("DaysSection");
  day.style.display = "block";
  let week = document.getElementById("WeeksSection");
  week.style.display = "none";
}

let fetchedProductionData;
async function GetDetails() {
  let obj = {
    year: yearval,
    month: monthval,
    day: dayval,
  };
  console.log(obj);
  // document.getElementById("chartToggleID").style.display = "block";
  let options = {
    method : "POST",
    headers:{'Content-Type':'application/json'},
    body : JSON.stringify(obj)
  };
  console.log(options);
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      productionChart([]);
      dispatchChart([]);
      if(data.length != undefined){
        alert("no data found");
      }else{
        productionChart(data.res.production);
        dispatchChart(data.res.dispatch);
      }
      
    })
    .catch((err) => console.log(err));
  fetch('/lpg/bulk',options).then(res=>res.json())
  .then(data=>{
    if( data.result != undefined){
      if( data.result.length > 0)
        getBulkChart(data.result);
      else
        alert('no data')
    }
    else{
      alert('no data');
    }
  });

  fetch('/lpg/consume',options).then(res=>res.json())
  .then(data=>{
    // console.log(data)  
    if( data.result != undefined){
      if( data.result.length > 0)
        getConsumeChart(data.result);
      else
        alert('no data')
    }
    else{
      alert('no data');
    }
  })
}

// charts data
function productionChart(data) {
  const labels = [];
  data.forEach((item) => {
    labels.push(item.type);
  });
  barCfg.data.datasets[0].data = data;
  barCfg.data.datasets[1].data = data;
  prodChart.update();
}

function dispatchChart(data) {
  const labels2 = [];
  data.forEach((item) => {
    labels2.push(item.type);
  });
  barCfg.data.datasets[0].data = data;
  barCfg.data.datasets[1].data = data;
  disChart.update();
}

function getBulkChart(data){
  var labels = [];
  data.forEach((item) => {
    labels.push(item.x);
  });
  var values = [];
  data.forEach((item) => {
    values.push(item.y);
  });
  pieConfig.data.labels = labels;
  pieConfig.data.datasets[0].data = values;
  bulkChart.update();
}

function getConsumeChart(data){
  var labels = [];
  data.forEach((item) => {
    labels.push(item.x);
  });
  var values = [];
  data.forEach((item) => {
    values.push(item.y);
  });
  console.log('in consume function')
  pieConfig.data.labels = labels;
  pieConfig.data.datasets[0].data = values;
  consumeChart.update();
}
