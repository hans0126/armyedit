var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({},{collection:"status_range_value"});

var statusAvg = mongoose.model('status_avg', customerSchema);
module.exports = statusAvg;
