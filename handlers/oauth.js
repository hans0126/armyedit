var user = require('../models/user.js');

exports.googleOauth = function(req, res) {

    res.send(req.user);

    //provider  email id gender

}


exports.loginProcess = function(req, res) {

    var provider = req.user.provider,
        email, name, token_id;

    switch (provider) {
        case "google":
            email = req.user.email;
            name = req.user.name;
            token_id = req.user.token_id;
            break;

    }

    user.find({
        token_id: token_id
    }, function(err, re) {
        if (err) throw err

        if (re.length == 0) { //redirect regist page
            req.session.newUser = true;
            res.redirect('./#/register');

            //res.send(req.user);
        } else {
            console.log("already");
        }

    })


    //  res.send(req.user.provider);
}


exports.frontGetToken = function(req, res) {

    if (req.user) {
        var provider = req.user.provider,
            email, name, token_id;

        switch (provider) {
            case "google":
                email = req.user.email;
                name = req.user.displayName;
                token_id = req.user.token_id;
                break;
        }

        var _d = {
            name: name,
            email: email,
            newUser: req.session.newUser
        }

        res.json(200, _d);

    } else {
        res.json(200, null);
    }
}


exports.checkMail = function(req, res) {
    var _m = req.body.mail;
    user.find({
        email: _m
    }, {}, function(err, re) {
        if (err) throw err
        var _returnValue = false;
        if (re.length == 0) {
            _returnValue = true;
        }

        res.json(200, _returnValue);
    })

}


exports.updateUser = function(req, res) {
    var _u = req.body;

    var userData = new user({
        display_name: req.user.displayName,
        email: req.user.email,
        token_id: req.user.id,
        name: _u.userName
    })

   

    userData.save(function(err) {
        if (err) return console.error(err);
        console.log("save ok");
    })

 

}
