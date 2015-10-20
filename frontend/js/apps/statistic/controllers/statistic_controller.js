define(function(require) {

    var app = require("app");

    app.controller("statistic", [
        "settingService",
        function(settingService) {
            var _self = this;
            _self.s = settingService;
        }
    ])




})
