define(function(require) {   
    angularAMD = require("angularAMD");
    var app = angular.module('myApp', ['ngRoute']);   

    return angularAMD.bootstrap(app);
})
