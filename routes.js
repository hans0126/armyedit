var basicLoad = require('./handlers/basic_load.js'),
    search = require('./handlers/search.js'),
    statusMapreduce = require('./handlers/status_mapreduce.js'),
    cards = require('./handlers/cards.js'),
   
    multer = require('multer'),
    upload = multer({
        dest: './upload_temp/'
    });


module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile(global.appRoot + '/index.html');
    });

    //init load 

    app.post('/get_category', basicLoad.getCategory);

    app.post('/get_ability', basicLoad.getAbility);

    app.post('/get_statusAvg', basicLoad.getStatusAvg);

    // search

    app.post('/search', search);

    // status mapreduce

    app.post('/status_mapreduce', statusMapreduce);

    //card 

    app.post('/get_card', cards.getCard);

    app.post('/inherit_card',upload.single('file'), cards.inheritCard);   

    /*
       
        app.post('/update_card', statusMapreduce);
        app.post('/add_new_card', statusMapreduce);
    */









}
