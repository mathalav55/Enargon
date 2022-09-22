require('dotenv').config()
var mongoose = require('mongoose');

<<<<<<< HEAD
<<<<<<< HEAD
var url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.2ahcutc.mongodb.net/?retryWrites=true&w=majority`;
=======
var url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.2ahcutc.mongodb.net/NewData?retryWrites=true&w=majority`;
>>>>>>> origin/main
=======
const url = 'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@cluster0.2ahcutc.mongodb.net/NewData?retryWrites=true&w=majority'

>>>>>>> origin/main
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