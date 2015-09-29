define(function(require) {

    var app = require("app");

    app.factory('productDetailFactory', [
        "$http",
        "$timeout",
        "radarFactory",
        "statusAvgService",
        "getCategoryService",

        function($http, $timeout, radarFactory, statusAvgService, getCategoryService) {

            var editCtrl = {
                edit: false,
                numShow: "show_inline",
                inputShow: "hide",
                saveBtnShow: "hide",
                editBtnText: "Edit",
                currentStatus: {},
                category: "A",
                currentProduct: null,
                msg: false,
                getStatusValue: function(_data) {
                    for (var key in _data) {
                        this.currentStatus[key] = _data[key];
                    }
                },
                editMode: function(va) {
                    if (va) {
                        this.edit = true;
                        this.editBtnText = "Cancel";

                    } else {
                        this.edit = false;
                        this.editBtnText = "Edit";
                        this.currentStatus = {};
                    }
                },
                editStatus: function(obj, mapping) {

                    if (this.currentProduct == null) {
                        return false;
                    }

                    if (this.edit == false) {
                        this.getStatusValue(obj.status);
                        this.editMode(true);
                    } else {
                        this.editMode(false);
                    }
                },
                mappingCategory: function(_data, mapping) {
                    var _d = {};

                    for (var i = 0; i < _data.length; i++) {
                        if (typeof(mapping[_data[i]]) != "undefined") {
                            //_d.push(mapping[_data[i]]);
                            _d[mapping[_data[i]].type] = {
                                title: mapping[_data[i]].title,
                                sort: mapping[_data[i]].sort
                            }
                        }
                    }
               
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

                        currentProduct.status = _self.currentStatus
                        _self.editMode(false);
                        _self.renderRadar();
                        _self.msg = true;
                        $timeout(function() {
                            _self.msg = false;
                        }, 2000)

                    })

                },
                getThisItem: function(_obj) {

                    if (this.currentProduct != null) {
                        if (this.currentProduct == _obj) {
                            return false;
                        }
                    }                    

                    this.currentProduct = _obj;
                    this.mappingCategory(this.currentProduct.relation, getCategoryService.categoryMapping);
                    this.editMode(false);
                    this.renderRadar();
                },
                renderRadar: function() {
                    var radar = radarFactory;
                    var radarElement = document.getElementById("radar");
                    radar.init();
                    radar.data.push(radar.transferData(this.currentProduct.status, statusAvgService.simple_data))
                    radar.render(radarElement);
                }
            }
            return editCtrl;
        }
    ])
})
