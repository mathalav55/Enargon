var app = require('./app');

var port = process.env.PORT || 3000;
//firing up server
var server = app.listen( port , function(){
    console.log('Server listening at port ' + port);
});