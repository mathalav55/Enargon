let selectYearEle = document.getElementById("SelectYear");
let selectMonthsEle = document.getElementById("SelectMonth");
let DayList = document.getElementById("SelectDay");
var WeekList = document.getElementById("SelectWeek");
let url = "/lpg";
const barCfg = {
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
};
var ctx2 = document.getElementById("chart2");
var ctx = document.getElementById("chart");
var prodChartElement = new Chart(ctx, barCfg);
var disChartElement = new Chart(ctx2, barCfg);

console.log("going til here");
// async function fetching(){
//   try{
//     fetch(url)
//     .then((res) =>  res.json())
//     .then((data) =>  console.log(data.res.production))
//     .catch((err) => console.log(err));
//   }catch(err){
//     console.log(err)
//   }
// }
// fetching()

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
function YearValue() {
  let selectedValue = selectYearEle.options[selectYearEle.selectedIndex].text;
  year = selectedValue;
  SelectionofDaysYearValue = selectedValue;
  yearval = selectedValue;
  console.log(selectedValue);
}

let min = 1;
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
}

function WeekValue() {
  let selectedValue = WeekList.options[WeekList.selectedIndex].text;
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
}

let fetchedProductionData;
async function GetDetails() {
  let obj = {
    year: yearval,
    month: monthval,
    week: weekval,
    day: dayval,
  };
  console.log(obj);
  document.getElementById("chartToggleID").style.display = "block";
let options  = {
  method : "POST",  
  headers : {
    "Content-Type" : "application/json"
  },
  body : JSON.stringify(obj)
}

  fetch(url,options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.res)
      if(data.res){
        productionChart(data.res.production);
        dispatchChart(data.res.dispatch);
      }else{
        productionChart([]);
        dispatchChart([]);
        alert("no data found");
      }
    })
    .catch((err) => console.log(err));
}

// charts data
function productionChart(data) {
  var ctx = document.getElementById("chart");
  // const labels = [];
  // data.forEach((item) => {
  //   labels.push(item.type);
  // });
  barCfg.data.datasets[0].data = data;
  barCfg.data.datasets[1].data = data;
  prodChartElement.update();
}

function dispatchChart(data) {
  const labels2 = [];
  data.forEach((item) => {
    labels2.push(item.type);
  });
  barCfg.data.datasets[0].data = data;
  barCfg.data.datasets[1].data = data;
  disChartElement.update();
}
