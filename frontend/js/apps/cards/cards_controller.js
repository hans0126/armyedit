define(function(require) {

    var app = require("app");
    require('js/lib/thumbEdit/thumbEdit.js');
    app.controller("cards_controller", ["$scope",
        "search",
        "statusAvgService",
        "getCategoryService",

        function($scope, search, statusAvgService, getCategoryService) {

            var _self = this;

            //  console.log(getCategoryService);

            statusAvgService.cardStatusFields = ["spd", "str", "mat", "rat", "def", "arm", "cmd", "focus"]

            $scope.searchType = "productCategory";

            _self.c = getCategoryService;

            search.itemSelect = function(_obj) {

                _self.editCard.reset();

                var _editData = _self.editCard.primaryCard;

                for (var i = 0; i < _obj.relation.length; i++) {
                    _tc = getCategoryService.simpleMapping[_obj.relation[i]]
                    _editData[_tc['type']] = _tc['_id'];
                }

                _editData.title = _obj.title;

                _editData.img = _self.thumbImg = "/images/army/normal/" + _obj.image_name

                _editData.parent_id = _obj._id;



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
                    title: null,
                    img: null,
                    series: null,
                    faction: null,
                    category: null,
                    pc: {
                        min: {
                            cost: null,
                            people: null
                        },
                        max: {
                            cost: null,
                            people: null
                        }
                    },
                    fa: null,
                    wj: null,
                    actor: []

                },
                actorTemplate: {
                    title: null,
                    status: {
                        spd: null,
                        str: null,
                        mat: null,
                        rat: null,
                        def: null,
                        arm: null,
                        cmd: null,
                        focus: null
                    },
                    img: {
                        thumb: null,
                        pX: null,
                        pY: null
                    }
                },
                getDuplicate: function(_obj) {
                    this.reset();
                },
                primaryCard: null,
                reset: function() {
                    this.primaryCard = angular.copy(this.cardTemplate);
                    this.primaryCard.actor.push(angular.copy(this.actorTemplate));
                },
                init: function() {
                    this.reset();
                },
                addActor: function() {
                    this.primaryCard.actor.push(angular.copy(this.actorTemplate));
                },
                removeActor: function(key) {
                    var _actor = this.primaryCard.actor;
                    for (var i = 0; i < _actor.length; i++) {
                        if (_actor[i].$$hashkey == key) {
                            _actor.splice(i, 1);
                            break;
                        }
                    }
                },
                save: function() {
                    console.log(this.primaryCard);
                }
            }

            _self.editCard.init();

            _self.statusAvgService = statusAvgService;

            _self.thumbShow = false;
            _self.thumbImg = null;
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
                        //   _t.init($scope.thumb, e.target.result, $scope.thumbs);
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
                idx: "@",
                currentActor: "=currentActor"
            },
            transclude: true,
            link: function(scope, element, attr) {

                var _thumbEdit = new thumbEdit();

                scope.edit = false;
                scope.editText = "Edit Thumb";
                scope.thumbEditReady = false;

                scope.editBtnClick = function() {
                    if (!scope.thumbImg) {
                        return false;
                    }

                    if (!scope.edit) {
                        scope.editText = "Cancel"
                        _thumbEdit.init('thumb' + scope.idx, scope.thumbImg, 'thumbs' + scope.idx);
                        scope.edit = true;
                        scope.thumbEditReady = true;
                    } else {
                        scope.currentActor.img.pX = 0;
                        scope.currentActor.img.pY = 0;
                        scope.editText = "Edit thumb"
                        scope.edit = false;
                    }
                }

                scope.apply = function() {
                    scope.currentActor.img.pX = _thumbEdit.output.x;
                    scope.currentActor.img.pY = _thumbEdit.output.y;
                    scope.editText = "Edit thumb"
                    scope.edit = false;
                }

                scope.$watch('thumbImg', function(_value) {
                    if (_value && scope.thumbEditReady) {
                        _thumbEdit.renew(_value);
                    }
                })

            },
            template: "<div ng-show='edit' class='editPopup'>" +
                "<canvas id='thumb{{idx}}'></canvas>" +
                "</div><div><button class='btn btn-primary' ng-click='editBtnClick()'>{{editText}}</button> " +
                "<button class='btn btn-primary' ng-if='edit' ng-click='apply()'>Apply</button></div>"

        }
    })



})
