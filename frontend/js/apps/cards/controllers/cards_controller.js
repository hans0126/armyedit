define(function(require) {

    var app = require("app");

    require('js/lib/thumbEdit/thumbEdit.js');
    require('js/apps/cards/directives/ability_edit.js');
    require('js/apps/cards/directives/thumb_images.js');
    require('js/apps/cards/directives/custom_on_change.js');
    require('js/apps/cards/services/db_ctrl.js');


    app.controller("cards_controller", ["$scope",
        "dbCtrlFactory",
        "searchTypeService",
        "settingService",
        function($scope, dbCtrlFactory, stService, settingService) {

            var _self = this;
            var dbCtrl = new dbCtrlFactory();
            var selectedObj = null;
            var cardsStatus = "new"; //  1.inherit 2.update 3.new(no parent)
            var imgPath = "/products/normal/";

            var cardTemplate;
            var actorTemplate;

            stService.searchBtnShow = true //select btn visible
            stService.searchType = "card" //cards or priducts    
            _self.s = settingService;
            _self.cardStatusText = null;

            _self.submitBtnDisabled = true;
            _self.primaryCard = null;
            _self.saveData = saveData;
            _self.addActor = addActor;
            _self.removeActor = removeActor;
            _self.createNew = createNew;


            // to search area stService.objectSelected
           stService.objectSelected = function(_obj) {

                if (_obj == selectedObj) {
                    return false;
                }

                _self.submitBtnDisabled = false;

                selectedObj = _obj;


                if (stService.searchType == "product") {
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
                        _self.primaryCard = response.data;
                        _self.thumbImg = imgPath + _self.primaryCard.image_name;
                        cardsStatus = "update";
                        _self.cardStatusText = "Inherited"

                    }, function() {
                        console.log("get data error")
                    })

                } else {

                    _self.cardStatusText = "data is not filed"

                    cardsStatus = "inherit";

                    resetData();

                    var _editData = _self.primaryCard;

                    for (var i = 0; i < selectedObj.relation.length; i++) {
                        _tc = settingService.categoryMapping[selectedObj.relation[i]]
                        _editData[_tc['type']] = _tc['_id'];
                    }

                    _editData.title = selectedObj.title;

                    _self.thumbImg = imgPath + selectedObj.image_name;
                    _editData.image_name = selectedObj.image_name;

                    _editData.parent_id = selectedObj._id;
                }

            }

            function cardsProcess() {
                _self.primaryCard = selectedObj;
                _self.thumbImg = imgPath + selectedObj.image_name;
                cardsStatus = "update";
            }

            cardTemplate = {
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

            }

            actorTemplate = {
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
            }

            function createNew() {
                cardsStatus = "new";
                selectedObj = null;
                _self.thumbImg = null;
                resetData();
            }


            function removeActor(_key) {
                var _actor = _self.primaryCard.actor;
                for (var i = 0; i < _actor.length; i++) {
                    if (_actor[i].$$hashKey == _key) {
                        _actor.splice(i, 1);
                        break;
                    }
                }
            }

            function addActor() {
                _self.primaryCard.actor.push(angular.copy(actorTemplate));
            }

            function saveData() {
                _self.submitBtnDisabled = true;
                var _d = {}
                _d.datas = angular.toJson(_self.primaryCard);
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
                            cardsStatus = "update";
                            _self.cardStatusText = "data was Inherited"
                        })

                        break;

                    case "new":
                        _d.type = "addNew";
                        dbCtrl.db(_d).then(function(response) {
                            $scope.msg.showMsg('add complete', 0);
                            _self.submitBtnDisabled = false;
                            cardsStatus = "update";
                            _self.cardStatusText = "data was Inherited"
                        })

                        break;
                }
            }

            function resetData() {
                _self.primaryCard = angular.copy(cardTemplate);
                _self.primaryCard.actor.push(angular.copy(actorTemplate));
            }

            resetData();

            //_self.thumbImg = null;

        }
    ])

})
