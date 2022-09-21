var express = require("express");
var router = express.Router();

// akhil
var lpg = require("./lpgSchema");

router.get("/", async (req, res, next) => {
  //get year sum

  var firstDay = getFirstDay(req.body);
  var lastDay = getLastDay(req.body);
  var data = await lpg.find({
    Date: { $gte: firstDay.getTime(), $lte: lastDay.getTime() },
    working: req.body.working,
  });
  // var data = await lpg.find();
  if (req.body.week) {
    data = getWeekData(data, parseInt(req.body.week));
  }
  res.status(200).json({
    message: "all good ...",
    len: data.length,
  });
});

// util functions
function aggregateData(data) {
  //prodcution sum
  //dispatch sum
  //gets an array
  const length = data.length;
  var expandingMean = 0;
  var sum = 0;
  //sum for all categories
  data.forEach((item) => {
    sum += parseInt(data.type);
  });
  //sends aggregate
}
function formatData(data) {
  var newData = [];
  var labels = [
    "14.2kg",
    "19kg",
    "5kg(RED)",
    "35kg",
    "47.5",
    "425kg",
    "5kg(FTL/FTR/BLUE)",
    "2kg(FTL/FTR/BLUE)",
  ];
  var dispatchfields = [
    "Days_Production_14.2kg",
    "Days_Production_19kg",
    "Days_Production_5kg(RED)",
    "Days_Production_35kg",
    "Days_Production_47.5",
    "Days_Production_425kg",
    "Days_Production_5kg(FTL/FTR/BLUE)",
    "Days_Production_2kg(FTL/FTR/BLUE)",
  ];
  var productionfields = [
    "Days_Despatches_14.2kg",
    "Days_Despatches_19kg",
    "Days_Despatches_5kg(RED)",
    "Days_Despatches_35kg",
    "Days_Despatches_47.5",
    "Days_Despatches_425kg",
    "Days_Despatches_5kg(FTL/FTR/BLUE)",
    "Days_Despatches_2kg(FTL/FTR/BLUE)",
  ];
  var categoryMap = [];
  //mapping label and field
  for (var i = 0; i < categories.length; i++) {
    var mapObj = {
      label: labels[i],
      dispatchFieldName: dispatchfields[i],
      productionFieldName: productionfields[i],
    };
    categoryMap.push(mapObj);
  }
  categoryMap.forEach((category) => {
    var newObj = {
      type: category.label,
      prod: data[category.productionFieldName],
      dis: data[category.dispatchFieldName],
    };
    newData.push(newObj);
  });
  return newData;
}
function getFirstDay(data) {
  var year = data.year != undefined ? data.year : 2021;
  var month = data.month != undefined ? data.month : 0;
  var day = data.day != undefined ? data.day : 1;
  var res = new Date(year, month, day, 5, 30);
  return res;
}
function getLastDay(data) {
  var year = data.year != undefined ? data.year : 2021;
  var month = data.month != undefined ? data.month : 11;
  var day = data.day != undefined ? data.day : 0;
  var res = new Date(year, month + 1, day, 5, 30);
  return res;
}
/*
 no of weeks 
 */
function getWeekData(data, weekNo) {
  console.log("got into week");
  var recStartNo = weekNo * 6;
  var recEndNo = weekNo * 6 + 6;
  data.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  var result = data.slice(recStartNo, recEndNo);
  return result;
}
module.exports = router;
