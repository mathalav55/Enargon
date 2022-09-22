// global values
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
var productionfields = [
    "dayProduction14_2Kg",
    "dayProduction19Kg",
    "dayProduction5Kg__Red__",
    "dayProduction35Kg",
    "dayProduction47_5Kg",
    "dayProduction425Kg",
    "dayProduction5KgFtl_Ftr__Blue__",
    "dayProduction2KgFtl_Ftr__Blue__"
];
var dispatchfields = [
  "dayDespatches14_2Kg",
  "dayDespatches19Kg",
  "dayDespatches5KgDom__Red__",
  "dayDespatches35Kg",
  "dayDespatches47_5Kg",
  "dayDespatches425Kg",
  "dayDespatches5KgFtl_Ftr__Blue__",
  "dayDespatches2KgFtl_Ftr__Blue__",
];
var allFields = productionfields.concat(dispatchfields);



var express = require("express");
const { aggregate } = require("./lpgSchema");
var router = express.Router();
// akhil
var lpg = require("./lpgSchema");

router.get("/", async (req, res, next) => {
  //get year sum

  var firstDay = getFirstDay(req.body);
  var lastDay = getLastDay(req.body);
  if (req.body.day) {
    lastDay = firstDay;
  } 
  var working = "true";
  if(req.body.working){
    working = req.body.working
  }
  var currentData = await lpg.find({
    date: { $gte: firstDay.getTime(), $lte: lastDay.getTime() },
    working,
  });
  var response = {
    length : currentData.length
  };
  if(currentData.length > 0){
    var globalData = await getGlobalAggregates();
    response = {
      res : combineData(currentData.length,formatData(globalData),formatData(currentData))
    }
  }
  res.status(200).json(response);
});

//global aggregates for comparision
async function getGlobalAggregates(){
  //field list
  //loop for preparation
  var groupArg = { 
    _id : null,
    workingDays : { $sum : 1} 
  };
  for( var i  =0; i < (labels.length*2) ; i ++){
      var temp = { $avg: `$${allFields[i]}` }
      groupArg[allFields[i]] = temp;
  }//single field
  var aggregate = await lpg.aggregate([
      { $match : { working : "true" } },
      { $group: groupArg}
  ]);
  return aggregate[0];
}
function aggregateData(data){
   var newData = Object.create(data[0]);
   newData = newData.toObject();
   var opData;
   for( var i = 0; i < data.length ; i++){
       opData = data[i].toObject();
       for(var j = 0; j < allFields.length ; j++){
          newData[allFields[j]] += opData[allFields[j]];
       }
   }
   return newData;
}
// util functions
function formatData(data) {
  if (data.length == 0) {
    return "no data";
  }
  var temp = data;
  if( data.length > 0){
    temp  = aggregateData(data);
  }
  var newData = [];
  for(var i = 0 ; i< labels.length ; i++){
    var newObj = {
      type: labels[i],
      prod: temp[productionfields[i]],
      dis: temp[dispatchfields[i]],
    };
    newData.push(newObj);
  };
  return newData;
}
function getFirstDay(data) {
  var year = data.year != undefined ? data.year : 2021;
  var month = data.month != undefined ? data.month : 0;
  var day = data.day != undefined ? data.day : 1;
  var res = new Date(year, month, day, 5, 30);
  console.log(res);
  return res;
}
function getLastDay(data) {
  var year = data.year != undefined ? data.year : 2021;
  var month = data.month != undefined ? data.month : 11;
  var day = data.day != undefined ? data.day : 0;
  var res = new Date(year, month + 1, day, 5, 30);
  console.log(res);
  return res;
}
function combineData(...args){
  console.log(args[0],args[1]);
  var sample = {
    "production" : [
      
    ],
    "dispatch" : [
      
    ], 
  };
  var dataLength = args[0];
  for(var i = 0; i < labels.length ; i++){
    //for prodution
    var prod = {
      type : labels[i],
      global : args[1][i].prod * dataLength,
      current : args[2][i].prod
    }
    //for dispatch
    var dis = {
      type : labels[i],
      global : args[1][i].dis * dataLength,
      current : args[2][i].dis
    };
    sample.production.push(prod);
    sample.dispatch.push(dis);
  };
  console.log(sample);
  return sample;
}
module.exports = router;
