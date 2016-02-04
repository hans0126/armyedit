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
            res.redirect('./#/register');

            //res.send(req.user);
        } else {

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
            email: email
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

        res.json(200,_returnValue );
    })

}
