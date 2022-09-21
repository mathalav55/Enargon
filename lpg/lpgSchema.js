var mongoose = require('mongoose');

var lpgSchema = mongoose.Schema({
        Date : Number,
        working : String
});

mongoose.model('dailydata',lpgSchema);

module.exports = mongoose.model('dailydata');
