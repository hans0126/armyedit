define(function(require) {

    var app = require("app");


    app.factory('productDetailFactory', [
        "$http",
        "radarFactory",
        "statusAvgService",
        function($http, radarFactory, statusAvgService) {

            var editCtrl = {
                edit: false,
                numShow: "show_inline",
                inputShow: "hide",
                saveBtnShow: "hide",
                editBtnText: "Edit",
                currentStatus: {},
                category: [],
                currentProduct: {},
                getStatusValue: function(_data) {
                    for (var key in _data) {
                        this.currentStatus[key] = _data[key];
                    }
                },
                editMode: function(va) {
                    if (va) {
                        this.edit = true;
                        this.numShow = "hide";
                        this.inputShow = "show_inline";
                        this.editBtnText = "Cancel";
                        this.saveBtnShow = "show_inline";
                    } else {
                        this.edit = false;
                        this.numShow = "show_inline";
                        this.inputShow = "hide";
                        this.editBtnText = "Edit";
                        this.saveBtnShow = "hide";
                        this.currentStatus = {};
                    }
                },
                editStatus: function(obj, mapping) {

                    if (this.edit == false) {

                        this.getStatusValue(obj.status);
                        // this.mappingCategory(obj.relation, mapping)

                        this.editMode(true);
                    } else {
                        this.editMode(false);
                    }
                },
                mappingCategory: function(_data, mapping) {

                    var _d = [];

                    for (var i = 0; i < _data.length; i++) {
                        if (typeof(mapping[_data[i]]) != "undefined") {
                            _d.push(mapping[_data[i]]);
                        }
                    }

                    _d.sort(function(a, b) {
                        return a.sort - b.sort
                    });

                    this.category = _d;

                },

                saveStatus: function(currentProduct) {
                    var _self = this;
                    // currentProduct.status = this.currentStatus;

                    var _data = {
                        id: currentProduct._id,
                        data: this.currentStatus,
                        type: "save_status"
                    }

                    $http.post("getData", _data).then(function(response) {

                        var radar = radarFactory;
                        var radarElement = document.getElementById("radar");

                        radar.init();
                        radar.data.push(radar.transferData(_self.currentStatus, statusAvgService.simple_data))
                        radar.render(radarElement);

                        currentProduct.status = _self.currentStatus
                        _self.editMode(false);

                    })

                },
                getThisItem: function(_obj) {
                    var _self = this;
                    if (_self.currentProduct != null) {
                        if (_self.currentProduct == _obj) {
                            return false;
                        }
                    }

                    _self.currentProduct = _obj;

                    _self.editMode(false);

                    var radar = radarFactory;
                    var radarElement = document.getElementById("radar");

                    radar.init();

                    radar.data.push(radar.transferData(_self.currentProduct.status, statusAvgService.simple_data))                   
                    radar.render(radarElement);

                }


            }

            return editCtrl;


        }
    ])






})
