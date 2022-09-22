var mongoose = require('mongoose');

var lpgSchema = mongoose.Schema({
        date : Number,
        working : String
});

mongoose.model('dailydata',lpgSchema);

module.exports = mongoose.model('dailydata');
