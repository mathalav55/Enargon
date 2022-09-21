require('dotenv').config()
var mongoose = require('mongoose');

const url = 'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@cluster0.2ahcutc.mongodb.net/NewData?retryWrites=true&w=majority'

mongoose.connect(
    url
)
.then(()=>{
    console.log("Connection Successful");
})
.catch(err=>{
    console.log(err.message);
    return "Error Connecting DB";
});