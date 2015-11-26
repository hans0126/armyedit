var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
	"_id":"String",
	"value":{}
},{collection:"status_range_value"});

var statusAvg = mongoose.model('status_avg', customerSchema);
module.exports = statusAvg;
