var cards = require('../models/cards.js'),
    products = require('../models/products.js'),
    mongoose = require('mongoose'),
    fs = require('fs');


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
    var _self = this;
    var _d = JSON.parse(req.body.datas);
    var _file = req.file;

    categoryIdConvertToObjectId.call(_d);

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
            console.log(re2);
            res.json(200, re._id);
        })


    })

    /* cards.insert(_d, function(err, re) {
         if (err) throw err;

         if (_d.parent_id) { //has products
             products.update({
                 _id: mongoose.Types.ObjectId(_d.parent_id)
             }, {
                 $set: {
                     copy: re.insertedIds[0]
                 }
             }, function(err, re2) {
                 if (err) throw err;
                 console.log(re.insertedIds[0]);
                 res.json(200, re.insertedIds[0]);
             })
         } else { //new card          
             res.json(200);
         }

     })*/
}

/*
cards.prototype.updateCard = function(_data, _file) {
    var _self = this;
    var _d = JSON.parse(_data);

    categoryIdConvertToObjectId.call(_d);
    abilityIdConvertToObjectId.call(_d);


    if (_file) {
        _d.img = uploadImage(_file);
    }

    _id = _d._id;
    delete _d._id

    MongoClient.connect(global.dbUrl, function(err, db) {

        var cardsDB = db.collection('cards');
        cardsDB.update({
            _id: ObjectID(_id)
        }, _d, function(err) {
            _self.emit("update data complete");
        })

    })

}

cards.prototype.addNewCard = function(_data, _file) {
    var _self = this;

    var _d = JSON.parse(_data);

    categoryIdConvertToObjectId.call(_d);

    if (_file) {
        _d.img = uploadImage(_file);
    }

    MongoClient.connect(global.dbUrl, function(err, db) {
        var cardsDB = db.collection('cards');

        cardsDB.insert(_d, function(err, re) {
            if (err) throw err;
            _self.emit("add new card complete", re[0]);
        })
    })

}

*/

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
                _actors[i].characterAbility[j] = mongoose.types.ObjectId(_actors[i].characterAbility[j]);
            }
        }
    }
}
