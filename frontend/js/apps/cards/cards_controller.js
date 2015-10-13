define(function(require) {

    var app = require("app");
    require('js/lib/thumbEdit/thumbEdit.js');
    app.controller("cards_controller", ["$scope",
        "statusAvgService",
        "getCategoryService",
        "dbCtrlFactory",
        "searchTypeService",
        "abilityService",
        function($scope, statusAvgService, getCategoryService, dbCtrlFactory, stService, abilityService) {

            var _self = this;
            var dbCtrl = new dbCtrlFactory();
            var selectedObj = null;
            var cardsStatus = "new"; //  1.inherit 2.update 3.new(no parent)

            _self.cardStatusText = null;


            _self.ability = abilityService;

            statusAvgService.cardStatusFields = ["spd", "str", "mat", "rat", "def", "arm", "cmd", "focus"]

            //$scope.searchType = "products";

            stService.searchType = "cards" //cards & priducts            

            _self.c = getCategoryService;

            _self.submitBtnDisabled = true;

            // to search area
            $scope.itemSelect = function(_obj) {
                if (_obj == selectedObj) {
                    return false;
                }

                _self.submitBtnDisabled = false;

                selectedObj = _obj;

                if (stService.searchType == "products") {
                    productsProcess();
                } else {
                    cardsProcess();
                }
            }

            function productsProcess() {

                if (selectedObj.copy) {
                    // has data
                    // get data
                    dbCtrl.getData(selectedObj.copy).then(function(response) {
                        _self.editCard.primaryCard = response.data;
                        _self.thumbImg = "/images/army/normal/" + _self.editCard.primaryCard.image_name;
                        cardsStatus = "update";

                        _self.cardStatusText = "Inherited"

                    }, function() {
                        console.log("get data error")
                    })

                } else {
                    // console.log("non");                    
                    _self.cardStatusText = "data is not created yet"

                    cardsStatus = "inherit";

                    _self.editCard.reset();

                    var _editData = _self.editCard.primaryCard;

                    for (var i = 0; i < selectedObj.relation.length; i++) {
                        _tc = getCategoryService.simpleMapping[selectedObj.relation[i]]
                        _editData[_tc['type']] = _tc['_id'];
                    }

                    _editData.title = selectedObj.title;

                    _self.thumbImg = "/images/army/normal/" + selectedObj.image_name;
                    _editData.image_name = selectedObj.image_name;

                    _editData.parent_id = selectedObj._id;
                }

            }

            function cardsProcess() {
                _self.editCard.primaryCard = selectedObj;
                _self.thumbImg = "/images/army/normal/" + selectedObj.image_name;
                cardsStatus = "update";
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
                    brief: "n"
                }],
                cardTemplate: {
                    parent_id: null,
                    title: null,
                    image_name: null,
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
                    fa: {
                        info: null,
                        num: null
                    },
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
                removeActor: function(_key) {
                    // console.log(this.primaryCard.actor);
                    var _actor = this.primaryCard.actor;
                    for (var i = 0; i < _actor.length; i++) {
                        if (_actor[i].$$hashKey == _key) {
                            _actor.splice(i, 1);
                            break;
                        }
                    }
                },
                save: function() {
                    _self.submitBtnDisabled = true;
                    var _d = {}
                    _d.datas = angular.toJson(this.primaryCard);
                    _d.file = _self.imgFile;

                    switch (cardsStatus) {
                        case "update":
                            _d.type = "updateCard";
                            dbCtrl.db(_d).then(function(response) {
                                $scope.msg.showMsg('update complete', 0);
                                _self.submitBtnDisabled = false;
                            })

                            break;

                        case "inherit":
                            _d.type = "inheritCard";
                            dbCtrl.db(_d).then(function(response) {
                                selectedObj.copy = response.data;
                                $scope.msg.showMsg('inherit complete', 0);
                                _self.submitBtnDisabled = false;
                            })

                            break;

                        case "new":
                            _d.type = "addNew";
                            dbCtrl.db(_d).then(function(response) {
                                $scope.msg.showMsg('add complete', 0);
                                _self.submitBtnDisabled = false;
                            })

                            break;
                    }
                },
                createNew: function() {
                    cardsStatus = "new";
                    selectedObj = null;
                    _self.thumbImg = null;
                    _self.editCard.reset();
                }
            }

            _self.editCard.init();

            _self.statusAvgService = statusAvgService;

            _self.thumbImg = null;

        }
    ])


    app.directive('customOnChange', function() {
        return {
            restrict: 'A',
            scope: {
                thumbImg: "=",
                imgFile: "="
            },
            link: function(scope, element, attrs) {
                // get function and bind change Event
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            },
            controller: function($scope) {
                // tips : define function in controller  , directive use this function 

                $scope.uploadFile = function() {

                    var _file = event.target.files[0];
                    var _fileType = _file.type;
                    _fileType = _fileType.split("/");
                    $scope.imgFile = _file;
                    if (_fileType[0] != "image") {
                        $scope.imgFile = null;
                        console.log("file format error!!");
                        return false;
                    }

                    var filename = _file.name;

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
                        scope.editText = "Apply"
                        _thumbEdit.init('thumb' + scope.idx, scope.thumbImg, 'thumbs' + scope.idx);
                        scope.edit = true;
                        scope.thumbEditReady = true;
                    } else {
                        scope.currentActor.img.pX = _thumbEdit.output.x;
                        scope.currentActor.img.pY = _thumbEdit.output.y;
                        scope.editText = "Edit thumb"
                        scope.edit = false;
                    }
                }

                scope.$watch('thumbImg', function(_value) {
                    if (_value && scope.thumbEditReady) {
                        _thumbEdit.renew(_value);
                    }
                })

            },
            template: "<div id='thumbs{{idx}}' class='thumbImg' style='background-position:{{currentActor.img.pX}}px {{currentActor.img.pY}}px;background-image:url({{thumbImg}})'></div>"+
            "<div ng-show='edit' class='editPopup'><canvas id='thumb{{idx}}'></canvas></div>" +           
            "<div><button class='btn btn-primary' ng-click='editBtnClick()'>{{editText}}</button></div>"
        }
    })

  app.directive("abilityEdit", function() {

    return {
         restrict: 'A',
         scope:{
            ability:"=abilityEdit"
         },
        link:function(scope,element,attr){
                
              

            scope.addAbility= function(){
                
            }

        },
        template:"<button ng-click='addAbility()'>Add Ability</button>"+
                "<div id='ability_popup'><div></div></div>"
    }

  })

    app.factory("dbCtrlFactory", ['$http', function($http) {

        function ctrl() {
            var _self = this;

            _self.db = function(_data) {
                var fd = new FormData();
                for (var _key in _data) {
                    fd.append(_key, _data[_key]);
                }

                return $http.post("cards", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
            }

            _self.getData = function(_id, _file) {
                var _d = {}
                _d.type = "getCard";
                _d.file = _file;
                _d.data = _id;

                return $http.post("cards", _d)
            }

        }
        return ctrl

    }])





})
