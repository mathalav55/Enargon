const express = require('express');
const lpgController = require('./lpg/lpgController');
const db = require('./db');
const app = express();
const path = require('path');   
//json data handling
app.use(express.urlencoded({
    extended : true
}));
app.use(express.json());

//entry points
app.use(express.static('frontend'))
app.use('/lpg',lpgController);
app.use('/home',(req, res, next) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
})
//bad entry error handlinguser
app.use('/' , (req , res, next) =>{
    const err = new Error('not found');
    err.status = 404;
    next(err);
});
//error handling
app.use((err , req , res , next) =>{
    res.status(err.status || 500);
    res.json({
        message : err.message,
    });
});

module.exports = app;