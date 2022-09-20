var mongoose = require('mongoose');

var lpgSchema = mongoose.Schema({
        Date : Number,
});

mongoose.model('dailydata',lpgSchema);

module.exports = mongoose.model('dailydata');