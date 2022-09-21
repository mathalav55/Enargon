var express = require('express');
var router = express.Router();

// akhil
var lpg = require('./lpgSchema');

router.get('/',async(req,res,next)=>{
    var firstDay = getFirstDay(req.body);
    var lastDay;
    if( req.body.day){
        lastDay = firstDay;
    }else{
        lastDay = getLastDay(req.body);
    }
    var data = await lpg.find({ Date : { $gt : firstDay.getTime(), $lte : lastDay.getTime()} },);

    if( req.body.week){

        data = getWeekData(data,parseInt(req.body.week));
    }
    res.status(200).json({
        message : "all good ...",
        len : data,
    });  
});


function getFirstDay(data){
    var year = (data.year != undefined) ? data.year : 2021;
    var month = (data.month != undefined) ? data.month : 0;
    var day = (data.day != undefined) ? data.day : 0;
    var res = new Date(year,month,day,5,30);
    return res;
}
function getLastDay(data){
    var year = (data.year != undefined) ? data.year : 2021;
    var month = (data.month != undefined) ? data.month : 12;
    var res = new Date(year,month+1,0,5,30);
    return res;
}
function getWeekData(data,weekNo){
    console.log('got into week')
    var recStartNo = weekNo * 6;
    var recEndNo = (weekNo * 6) + 6;
    data.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
    });
    var result = data.slice(recStartNo,recEndNo);
    return result;
}
module.exports = router;


