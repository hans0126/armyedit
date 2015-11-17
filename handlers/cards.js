var cards = require('../models/cards.js'),
    products = require('../models/products.js'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    imgPath = "frontend/products/";

//mongoose.set('debug', true);
// mongoose.Types.ObjectId

exports.getCard = function(req, res) {

    var _id = mongoose.Types.ObjectId(req.body.data);

    cards.findOne({
        _id: _id
    }, function(err, re) {
        res.json(200, re);
    })
};


exports.inheritCard = function(req, res) {

    var _d = JSON.parse(req.body.datas);
    var _file = req.file;
    imgProcess.call(_d);
    categoryIdConvertToObjectId.call(_d);
    abilityIdConvertToObjectId.call(_d);


    if (_file) {
        _d.img = uploadImage(_file);
    }

    cards(_d).save(function(err, re) {

        products.update({
            _id: mongoose.Types.ObjectId(_d.parent_id)
        }, {
            $set: {
                copy: re._id
            }
        }, function(err, re2) {

            res.json(200, re._id);
        })


    })
}


exports.updateCard = function(req, res) {

    var _d = JSON.parse(req.body.datas);
    var _file = req.file;

    imgProcess.call(_d);
    categoryIdConvertToObjectId.call(_d);
    abilityIdConvertToObjectId.call(_d);

    if (_file) {
        _d.img = uploadImage(_file);
    }

    _id = _d._id;
    delete _d._id;

    cards.update({
        _id: mongoose.Types.ObjectId(_id)
    }, _d, function(err) {
        console.log(_d.actor);
        res.json(200, _d.actor);
    })
}


exports.addNewCard = function(req, res) {

    var _d = JSON.parse(req.body.datas);
    var _file = req.file;

    imgProcess.call(_d);
    categoryIdConvertToObjectId.call(_d);
    abilityIdConvertToObjectId.call(_d);

    if (_file) {
        _d.img = uploadImage(_file);
    }

    cards(_d).save(function(err, re) {
        if (err) throw err;
        res.json(200, re);
    })

}



function uploadImage(_file) {
    var fx = _file.originalname.split(".");
    fx = fx[fx.length - 1];
    var newFileName = new Date().getTime() + "-" + Math.floor(Math.random() * 1000) + "." + fx;

    var tmp_path = _file.path;
    var target_path = 'uploads/' + newFileName;
    var thumb_path = 'uploads/thumb/' + newFileName;

    gm(tmp_path).write(target_path, function(err) {
        if (err) throw err;
        gm(tmp_path).resize(130, 130).write(thumb_path, function(err) {
            if (err) throw err;
            // fs.unlink(tmp_path);
        })
    })

    return newFileName

}

function categoryIdConvertToObjectId() {
    var _tempC = ["series", "faction", "category"]

    for (var i = 0; i < _tempC.length; i++) {
        if (this[_tempC[i]] != null) {
            this[_tempC[i]] = mongoose.Types.ObjectId(this[_tempC[i]]);

        }
    }


    //return _data

}

function abilityIdConvertToObjectId() {
    var _actors = this.actor;
    for (var i = 0; i < _actors.length; i++) {
        if (_actors[i].characterAbility) {
            for (j = 0; j < _actors[i].characterAbility.length; j++) {
                _actors[i].characterAbility[j] = mongoose.Types.ObjectId(_actors[i].characterAbility[j]);

            }
        }
    }


}


//get thumb img and banner img. binary to file

function imgProcess() {

    var _actors = this.actor;

    for (var i = 0; i < _actors.length; i++) {

        for (var key in _actors[i].newImg) {
            var _img = _actors[i].newImg[key],
                _fileName,
                _buf;

            if (_img) {
                //remove old file                
                if (_actors[i].img[key]) {
                    fs.unlink(imgPath + "actor_" + key + '/' + _actors[i].img[key], function(err) {
                        if (err) throw err;
                    });
                }

                _fileName = new Date().getTime() + "-" + Math.floor(Math.random() * 1000) + ".png";
                _img = _img.replace(/^data:image\/\w+;base64,/, "");
                _buf = new Buffer(_img, 'base64');

                _actors[i].img[key] = _fileName;
                fs.writeFile(imgPath + "actor_" + key + '/' + _fileName, _buf);

            }
        }

        if (_actors[i].hp.damage_type == "warbeast") {
            if (_actors[i].img.damage) {
                fs.unlink(imgPath + "actor_damage/" + _actors[i].img.damage, function(err) {
                    if (err) throw err;
                });

                _actors[i].img.damage = null;
            }
        }

        delete _actors[i].newImg;
    }


}
