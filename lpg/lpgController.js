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
var bulkOpeningFields = [
  "bulkOpening__Dom__",
  "bulkOpening__Nd__",
  "bulkClosing__Dom__",
  "bulkClosing__Nd__"
];
var consumableFields = [
  "closingGoodValves",
  "closingGoodRegulators",
  "closingORings",
  "closingPvcSeal",
  "closingScCaps"
]
var allFields = productionfields.concat(dispatchfields);
var express = require("express");
var router = express.Router();
// akhil
var lpg = require("./lpgSchema");

router.post("/", async (req, res, next) => {
  //get year sum
  var currentData;
  var firstDay = getFirstDay(req.body);
  var lastDay = getLastDay(req.body);
  if (req.body.day) {
    lastDay = firstDay;
  } 
  var working = "true";
  if(req.body.working){
    working = req.body.working
  }
  currentData = await lpg.find({
    date: { $gte: firstDay.getTime(), $lte: lastDay.getTime() },
    working,
  });
  var response = {
    length : currentData.length,
    firstDay,
    lastDay
  };
  if(currentData.length > 0){
    var globalData = await getGlobalAggregates(lastDay);
    response = {
      res : combineData(currentData.length,formatData(globalData),formatData(currentData)),
      datalength : currentData.length
    }
  }
  res.status(200).json(response);
});

router.post('/bulk',async(req,res,next)=>{
  //prepeare date from req
  var date = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day), 5, 30);
  //find values with the date
  var data =await lpg.findOne( {date : date});
  //prepare data for pie format { fieldname , value}
  var result = {

  };
  data = data.toObject();
  bulkOpeningFields.forEach(field=>{
    result[field] = data[field];
    console.log(field);
  })
  res.status(200).json({
    result,
    date,
  })
});

router.post('/consume',async (req,res,next)=>{
  //prepeare date from req
  var date = new Date(parseInt(req.body.year), parseInt(req.body.month), parseInt(req.body.day), 5, 30);
  //find values with the date
  var data =await lpg.findOne( {date : date});
  //prepare data for pie format { fieldname , value}
  var result = {

  };
  data = data.toObject();
  consumableFields.forEach(field=>{
    result[field] = data[field];
    console.log(field);
  })
  res.status(200).json({
    result,
    date,
  })
});
//global aggregates for comparision
async function getGlobalAggregates(lastDay){
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
  // console.log(allFields);
  var aggregate = await lpg.aggregate([
      { $match : { "$and":[{ working : "true"},{ date: { $lte: lastDay.getTime() } } ] }  },
      { $group: groupArg}
  ]);
  console.log(aggregate[0]);
  return aggregate[0];
}
function aggregateData(data){
   var newData = Object.create(data[0]);
   newData = newData.toObject();
   var opData;
   for( var i = 1; i < data.length ; i++){
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
  var year = data.year != undefined ? parseInt(data.year) : 2021;
  var month = data.month != undefined ? parseInt(data.month) : 0;
  var day = data.day != undefined ? parseInt(data.day) : 1;
  if(data.week != undefined){
    return getWeekDates(month,year)[0];
  }
  var res = new Date(year, month, day, 5, 30);
  console.log(res);
  return res;
}
function getLastDay(data) {
  var year = data.year != undefined ? parseInt(data.year) : 2021;
  var month = data.month != undefined ? parseInt(data.month) : 11;
  var day = data.day != undefined ? parseInt(data.day) : 0;
  if(data.week != undefined){
    return getWeekDates(month,year)[1];
  }
  var res = new Date(year, month + 1, day, 5, 30);
  console.log(res);
  return res;
}
function combineData(...args){
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
  return sample;
}
function getWeekDates(year,month){
  var date = new Date();
  return [date,date];
}
module.exports = router;
