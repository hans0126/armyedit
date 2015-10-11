define(function(require) {   
    angularAMD = require("angularAMD");
    var app = angular.module('myApp', ['ngRoute','ngAnimate']);   

    return angularAMD.bootstrap(app);
})
