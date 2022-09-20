const express = require('express');
const lpgController = require('./lpg/lpgController');
const db = require('./db');
const app = express();

//json data handling
app.use(express.urlencoded({
    extended : true
}));
app.use(express.json());

//entry points
app.use('/lpg',lpgController);

//bad entry error handling
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