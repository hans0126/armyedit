define(function(require) {

    var app = require('app');
    // var factory = require('factory');
    //  var controller = require('controller');
    require('apps/factory/search_factory');
    require('apps/directive/radar_directive');
    require('apps/controller/radar_controller');





    

    app.controller("a", function($scope) {
        console.log("A");
    })

    /*  
    var directive = require('directive');
    var controller = require('controller');
*/



    //   app.controller('main', controller.main);
    /* app.directive('itemSelect', directive.itemSelect);
     app.directive('itemSearch', directive.itemSearch);
     app.directive('imageonload', directive.imageonload);
     app.directive('productList', ["$compile", "dataTemplates", directive.productList])
     app.directive('subContent', ["$compile", "dataTemplates", "$http", "$templateCache", "$parse", directive.subContent])

     app.directive('radar', directive.radar);
     app.directive('detailStatus', directive.detailStatus);*/

    /*factory = require('factory');
    app.factory('dataTemplates', factory.dataTemplates);*/




})
