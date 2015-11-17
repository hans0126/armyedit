var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    "parent_id": "ObjectId",
    "title": "String",
    "image_name": "String",
    "series": "ObjectId",
    "faction": "ObjectId",
    "category": "ObjectId",
    "pc": {
        "min": {
            "cost": "Number",
            "people": "Number"
        },
        "max": {
            "cost": "Number",
            "people": "Number"
        }
    },
    "fa": {
        "info": "String",
        "num": "Number"
    },
    "wj": "String",
    "actor": [{
        "title": "String",
        "characterAbility": [],
        "img": {           
            "thumb": "String",
            "banner": "String",
            "damage": "String"
        },
        "status": {
            "threshold": "Number",
            "focus": "Number",
            "cmd": "Number",
            "arm": "Number",
            "def": "Number",
            "rat": "Number",
            "mat": "Number",
            "str": "Number",
            "spd": "Number"
        },
        "hp":{
           "damage_type":"String",
            "count":"Number",           
            "systems":[],
            "warbeast_detail":{},
            "warjack_detail":[]
        }
    }]
}, {
    collection: "cards"
});

var cards = mongoose.model('cards', customerSchema);
module.exports = cards;
