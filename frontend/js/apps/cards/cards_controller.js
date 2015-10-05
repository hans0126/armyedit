define(function(require) {

    var app = require("app");
    require('js/lib/thumbEdit/thumbEdit.js');
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
                    num: null
                }],
                cardTemplate: {
                    title: "A",
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
                    group: null,
                    actor: []

                },
                actorTemplate: {
                    idx:0,
                    title: 1,
                    status: {
                        spd: 2,
                        str: 3,
                        mat: 4,
                        rat: 5,
                        def: 6,
                        arm: 7,
                        cmd: null,
                        focus: null
                    },
                    img: {
                        thumb: null
                    }
                },
                getDuplicate: function(_obj) {
                    this.reset();
                    // this.primaryCard.title = "A";
                },
                primaryCard: null,
                reset: function() {
                    this.primaryCard = angular.copy(this.cardTemplate);
                    this.primaryCard.actor.push(angular.copy(this.actorTemplate));
                },
                init: function() {
                    this.reset();
                },
                addActor:function(){
                     this.primaryCard.actor.push(angular.copy(this.actorTemplate));                     
                },
                removeActor:function(key){                  
                    var _actor = this.primaryCard.actor;
                    for(var i=0;i<_actor.length;i++){
                        if(_actor[i].$$hashkey==key){
                           _actor.splice(i,1);
                           break; 
                        }
                    }
                }


            }


            _self.editCard.init();

            _self.statusAvgService = statusAvgService;

            _self.thumbShow = false;

            //$scope.thumbImg = null;

        }
    ])


    app.directive('customOnChange', function() {
        return {
            restrict: 'A',
            scope: {
                thumb: "@",
                thumbs: "@",
                showThumb: "=",
                thumbImg: "="
            },
            link: function(scope, element, attrs) {
                // get function and bind change Event
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            },
            controller: function($scope) {
                // tips : define function in controller  , directive use this function 
                var _t = new thumbEdit();
                $scope.uploadFile = function() {
                    $scope.showThumb = true;

                    var filename = event.target.files[0].name;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $scope.thumbImg = e.target.result;
                        $scope.$apply();
                        _t.init($scope.thumb, e.target.result, $scope.thumbs);
                    };
                    reader.readAsDataURL(event.target.files[0]);
                };

            }
        };
    });

    app.directive("thumbImages", function() {
        return {
            restrict: 'A',
            scope: {
                thumbImg: "=thumbImages",
                idx: "@"
            },
            link: function(scope, element, attr) {
                var _b = element.find('button');
                _b.bind('click', function() {
                    var _t = new thumbEdit();
                    _t.init('thumb'+scope.idx, scope.thumbImg, 'thumbs'+scope.idx);
                })

                //  console.log(scope.thumbImg)
            }

        }
    })



})
