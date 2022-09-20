var express = require('express');
var router = express.Router();

var lpg = require('./lpgSchema');

router.get('/',async(req,res,next)=>{
    var firstDay = getFirstDay(req.body);
    var lastDay = getLastDay(req.body);
    
    const data = await lpg.find({ Date : { $gte : firstDay, $lte : lastDay} },);
    res.status(200).json({
        message : "all good ...",
        len : data.length,
    });  
});

function getFirstDay(data){
    var year = data.year ? data.year : 2021;
    var month = data.month ? data.month : 0;
    var res = new Date(year,month,1,5,30);
    console.log(res.toLocaleDateString());
    return res.getTime();
}
function getLastDay(data){
    var year = data.year ? data.year : 2021;
    var month = data.month ? data.month : 12;
    var res = new Date(year,month+1,0,5,30);
    console.log(res.toLocaleDateString());
    return res.getTime();
}
module.exports = router;