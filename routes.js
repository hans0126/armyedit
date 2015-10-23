var basicLoad = require('./handlers/basic_load.js'),
search = require('./handlers/search.js');

module.exports = function(app) {

	//init load 

    app.post('/get_category', basicLoad.getCategory);

    app.post('/get_ability', basicLoad.getAbility);

    app.post('/get_statusAvg', basicLoad.getStatusAvg);

    // search

    app.post('/search', search);

}
