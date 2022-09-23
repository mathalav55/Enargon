let selectYearEle = document.getElementById("SelectYear");
let selectMonthsEle = document.getElementById("SelectMonth");
let DayList = document.getElementById("SelectDay");
var WeekList = document.getElementById("SelectWeek");
let url = "/lpg";

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
let demoWeekListValue;
let dateArr = [];

function MonthValue() {
  // getting the month value ex: jan : 1,feb: 2....
  dayval = undefined
  let max;
  let selectedValue =
    selectMonthsEle.options[selectMonthsEle.selectedIndex].value;
  console.log(Number(selectedValue) + 1);
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
  demoWeekListValue = weeksList;
  if (demoWeekListValue == undefined) {
    window.alert("select month");
  } else {
    let startDay, endDay;
    const option = document.createElement("option");
    var final = "";
    let finalResultWeek;
    dateArr.length = 0
    for (let i = 0; i < demoWeekListValue.length; i++) {
      startDay = new Date(
        yearValueForGettingWeek,
        MonthValueForGettingWeek - 1,
        demoWeekListValue[i].start
      );
      endDay = new Date(
        yearValueForGettingWeek,
        MonthValueForGettingWeek - 1,
        demoWeekListValue[i].end
      );
      finalResultWeek = `start : ${startDay.toLocaleDateString()} - End : ${endDay.toLocaleDateString()}`;
      dateArr.push(finalResultWeek);
    }
    console.log(dateArr);
  }
  if (dateArr.length > 0) {
    var final = ""
    for (let i = 0; i < dateArr.length; i++) {
      // let optionEle = document.createElement("option");
      // optionEle.value = i;
      // optionEle.innerHTML = dateArr[i];
      // WeekList.appendChild(optionEle);
      let weekOption = `<option value="${i}">${dateArr[i]}</option>`
      final += weekOption
    }
    WeekList.innerHTML = final;
  }
}

function WeekValue() {
  let selectedValue = WeekList.options[WeekList.selectedIndex].value;
  console.log(Number(selectedValue));
  weekval = selectedValue;
  dayval = undefined
}

function DayValue() {
  let selectedValue = DayList.options[DayList.selectedIndex].value;
  // day = selectedValue;
  weekval = undefined
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
  dayval = undefined
}
function dayBtn() {
  weekBtn();
  weekval = undefined
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
    week: weekval,
    day: dayval,
  };
  console.log(obj);
  document.getElementById("chartToggleID").style.display = "block";
  let options = {
    method: "GET",
    body: JSON.stringify(obj),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.res.production);
      productionChart(data.res.production);
      dispatchChart(data.res.dispatch);
    })
    .catch((err) => console.log(err));
}

// charts data
function productionChart(data) {
  var ctx = document.getElementById("chart");
  const labels = [];
  data.forEach((item) => {
    labels.push(item.type);
  });
  const cfg = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Global",
          data: data,
          parsing: {
            yAxisKey: "global",
            xAxisKey: "type",
          },
          backgroundColor: "#f00",
        },
        {
          label: "Current",
          data: data,
          parsing: {
            yAxisKey: "current",
            xAxisKey: "type",
          },
          backgroundColor: "#f0f",
        },
      ],
    },
  };
  var chart = new Chart(ctx, cfg);
}

function dispatchChart(data) {
  var ctx2 = document.getElementById("chart2");
  const labels2 = [];
  data.forEach((item) => {
    labels2.push(item.type);
  });
  const cfg2 = {
    type: "bar",
    data: {
      labels2,
      datasets: [
        {
          label: "Global",
          data: data,
          parsing: {
            yAxisKey: "global",
            xAxisKey: "type",
          },
          backgroundColor: "#f00",
        },
        {
          label: "Current",
          data: data,
          parsing: {
            yAxisKey: "current",
            xAxisKey: "type",
          },
          backgroundColor: "#f0f",
        },
      ],
    },
  };
  var chart = new Chart(ctx2, cfg2);
}
