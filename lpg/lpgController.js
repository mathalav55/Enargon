var express = require('express');
var router = express.Router();

var lpg = require('./lpgSchema');


var params = {
    year : 2021
};

var firstDay = getFirstDay(params);
var lastDay = getLastDay(params);

router.get('/',async(req,res,next)=>{
    const data = await lpg.find({ Date : { $gte : firstDay, $lte : lastDay} },);
    res.status(200).json({
        message : "all good ..."
    });  
});

function getFirstDay(data){
    var year = 2021 || data.year;
    var month = 0 || data.month;
    var res = new Date(year,month,1,5,30);
    return res.getTime();
}
function getLastDay(data){
    var year = 2021 || data.year;
    var month = 12 || data.month;
    var res = new Date(year,month+1,0,5,30);
    return res.getTime();
}
module.exports = router;