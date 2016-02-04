var basicLoad = require('./handlers/basic_load.js'),
    search = require('./handlers/search.js'),
    statusMapreduce = require('./handlers/status_mapreduce.js'),
    cards = require('./handlers/cards.js'),
    parser = require('./handlers/parser.js'),
    oauth = require('./handlers/oauth.js'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth2').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;


multer = require('multer'),
    upload = multer({
        dest: './upload_temp/'
    }),
    cpUpload = upload.fields([{
        name: 'thumb',
        maxCount: 10
    }, {
        name: 'banner',
        maxCount: 10
    }])


module.exports = function(app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    var GOOGLE_CLIENT_ID = "76530001040-sq318gj5rdtr7vocqdfhsjer9vep65df.apps.googleusercontent.com",
        GOOGLE_CLIENT_SECRET = "5eIP9ZJq4Uu3pEkyoTJ_i70I",
        FACEBOOK_APP_ID = "223259027847992",
        FACEBOOK_APP_SECRET = "606625b9577c93781012eaf3f0f9788b";

    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            //NOTE :
            //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
            //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
            //then edit your /etc/hosts local file to point on your private IP. 
            //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
            //if you use it.
            callbackURL: "http://localhost:3000/google_oauth",
            passReqToCallback: true
        },
        function(request, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function() {

                // To keep the example simple, the user's Google profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Google account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));


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

    //cards

    app.post('/get_card', cards.getCard);

    app.post('/inherit_card', upload.single('file'), cards.inheritCard);

    app.post('/update_card', upload.single('file'), cards.updateCard);

    app.post('/add_new_card', upload.single('file'), cards.addNewCard);

    //parse

    app.get('/_p', parser.parserWeb);
    app.get('/_i', parser.parserImg);

    //oauth

    app.get('/google_oauth', passport.authenticate('google', {
        failureRedirect: '/oauth_fail'
    }), function(req, res) {
        res.redirect('/user_login_process');
    });

    app.get('/user_login_process', oauth.loginProcess);
    app.post('/front_get_token', oauth.frontGetToken);
    app.post('/check_mail',oauth.checkMail);

    /*
    app.get('/p', function(req, res) {
        //parse web data
        var parser = require("./my_modules/parser.js");
        var pF = new parser.parserFaction();



        //pF.startParser();
        //pF.checkHasImg();
        //pF.getNoHasImg();

        pF.on("all complete", function() {
            console.log("parse end")
        })


        pF.on("save complete", function() {
            console.log("this ok");
        })


        //var ca = new parser.createCategory2DB();
        // ca.start();

        // res.send("ok");

    });
*/

}
