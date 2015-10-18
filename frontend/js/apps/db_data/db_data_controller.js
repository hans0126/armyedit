define(function(require) {

    var app = require("app");

    app.controller("db_data", [
        "settingService",
        function(settingService) {

            var _self = this;

            _self.s = settingService;


        }
    ])




})
