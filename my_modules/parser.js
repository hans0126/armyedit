var util = require('util'); //繼承object
var events = require('events'); //事件
var request = require('request');
var cheerio = require('cheerio');

function parserFaction() {}

util.inherits(parserFaction, events.EventEmitter);

parserFaction.prototype.parser = function(url) {

    //url = "http://privateerpress.com/warmachine/gallery/cygnar/warcasters";
    request(url, function(err, resp, body) {
        var tt = [];
        $ = cheerio.load(body);

        links = $('.views-row'); //use your CSS selector here        

        $(links).each(function(i, link) {
            tt += $(link).find('.views-field-field-image-fid img').attr('src');

        });

        this.emit('response', tt);

    }.bind(this));

};


module.exports = {
	parserFaction:parserFaction
}
