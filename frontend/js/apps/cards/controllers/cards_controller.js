define(function(require) {

    var app = require("app");



    app.controller("cards_controller", ["$scope",
        "dbCtrlFactory",
        "searchTypeService",
        "settingService",
        function($scope, dbCtrlFactory, stService, settingService) {

            var _self = this;
            var dbCtrl = new dbCtrlFactory();
            var selectedObj = null;
            var originalObj = null; 
            var cardsStatus = "new"; //  1.inherit 2.update 3.new(no parent)
            var imgPath = "/products/";


            var cardTemplate;
            var actorTemplate;

            stService.searchBtnShow = true //select btn visible
            stService.searchType = "card" //cards or priducts    

            _self.s = settingService;
            _self.cardStatusText = null;
            _self.thumbImg = null;
            _self.actorThumb = null;
            _self.actorBanner = null;

            _self.submitBtnDisabled = false;
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

                _self.thumbImg = null;
                _self.submitBtnDisabled = false;

                selectedObj = angular.copy(_obj);
                originalObj = _obj;

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
                        cardsStatus = "update";
                        _self.cardStatusText = "Inherited";

                        if (_self.primaryCard.image_name) {
                            _self.thumbImg = imgPath + "normal/" + _self.primaryCard.image_name;
                        }

                        checkInitImg(_self.primaryCard.actor);

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

                    if (selectedObj.image_name) {
                        _self.thumbImg = imgPath + "normal/" + selectedObj.image_name;
                    }

                    _editData.image_name = selectedObj.image_name;

                    _editData.parent_id = selectedObj._id;
                }

            }

            function cardsProcess() {
                _self.primaryCard = selectedObj;

                if (selectedObj.image_name) {
                    _self.thumbImg = imgPath + "normal/" + selectedObj.image_name;
                }

                checkInitImg(_self.primaryCard.actor);

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
                    focus: null,
                    threshold: null
                },
                hp: {
                    damage_type: null,
                    count: null,
                    systems: [],
                    detail: []
                },
                img: {
                    thumb: null,
                    banner: null,
                    damage: null
                },
                newImg: {
                    thumb: null,
                    banner: null,
                    damage: null
                },
                showImg: {
                    thumb: null,
                    banner: null,
                    damage: null
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

                var _d = {};
                var _tempCard = angular.copy(_self.primaryCard);

                for (var i = 0; i < _tempCard.actor.length; i++) {
                    var _actor = _tempCard.actor[i];

                    delete _actor.showImg;

                    if (_actor.hp.damage_type == "warjack") {
                        _actor.hp.warbeast_detail = null;
                    } else if (_actor.hp.damage_type == "warbeast") {
                        _actor.hp.warjack_detail = null;
                        _actor.hp.systems = null;
                    }
                }

                _d.datas = angular.toJson(_tempCard);

                switch (cardsStatus) {
                    case "update":
                        dbCtrl.update(_d, "update_card").then(function(response) {
                            $scope.msg.showMsg('update complete', 0);
                            _self.submitBtnDisabled = false;
                            _self.primaryCard = response.data;
                            selectedObj = angular.copy(_self.primaryCard);                        
                            angular.extend(originalObj, _self.primaryCard);                        
                            cardsProcess();
                        })

                        break;

                    case "inherit":
                        dbCtrl.update(_d, "inherit_card").then(function(response) {
                            selectedObj.copy = response.data;
                            $scope.msg.showMsg('inherit complete', 0);
                            _self.submitBtnDisabled = false;
                            cardsStatus = "update";
                            _self.cardStatusText = "data was Inherited"
                        })

                        break;

                    case "new":
                        dbCtrl.update(_d, "add_new_card").then(function(response) {
                            $scope.msg.showMsg('add complete', 0);
                            _self.submitBtnDisabled = false;
                            cardsStatus = "update";
                            _self.cardStatusText = "data was Inherited"
                        })

                        break;
                }


            }

            function checkInitImg(actors) {
                for (var i = 0; i < actors.length; i++) {
                    if (!actors[i].showImg) {
                        actors[i].showImg = {
                            banner: null,
                            thumb: null,
                            damage: null
                        }
                    }

                    for (var key in actors[i].img) {
                        if (actors[i].img[key]) {
                            actors[i].showImg[key] = imgPath + "actor_" + key + "/" + actors[i].img[key];
                        }
                    }
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
