define(function(require) {

    var app = require("app");

    app.controller("cards_controller", ["$scope",
        "search",
        "statusAvgService",
        "getCategoryService",

        function($scope, search, statusAvgService, getCategoryService) {

            var _self = this;

            $scope.searchType = "productCategory";

            _self.c = getCategoryService;

            search.itemSelect = function(_obj) {
                _self.editCard.getDuplicate(_obj);
            }


            _self.editCard = {
                fa: [{
                    title: "Unlimit",
                    brief: "u"
                }, {
                    title: "Character",
                    brief: "c"
                }, {
                    title: "Number",
                    brief: "n",
                    num:null
                }],
                cardTemplate: {
                    title: null,
                    status: {
                        spd: null,
                        str: null,
                        mat: null,
                        rat: null,
                        def: null,
                        arm: null,
                        cmd: null
                    },
                    img: {
                        normal: null,
                        thumb: null
                    },
                    series: null,
                    faction: null,
                    category: null,
                    pc: null,
                    fa: null,
                    wj: null,
                    focus: null
                },
                getDuplicate: function(_obj) {
                    this.reset();
                    this.primaryCard.title = "A";
                },
                primaryCard: null,
                reset: function() {
                    this.primaryCard = angular.copy(this.cardTemplate)
                }

            }


            _self.statusAvgService = statusAvgService;



        }
    ])




})
