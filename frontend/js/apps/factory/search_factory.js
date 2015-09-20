define(function(require) {

    var app = require("app");

    app.factory('search', function() {

        var itemSearch = {
            http: null,
            scope: null,
            pageshow: 9,
            currentPage: 0,
            totalPageCount: 0,
            totalItemCount: 0,
            returnArmy: [],
            status_avg: {},
            selectGroup: {
                series: {
                    data: null,
                    default_value: null,
                    selected_value: null
                },
                faction: {
                    data: null,
                    default_value: null,
                    selected_value: null
                },
                category: {
                    data: null,
                    default_value: null,
                    selected_value: null
                }
            },
            keyword: {
                default_value: "",
                selected_value: null
            },
            seriesSelect: function($http) {

                if (this.selectGroup.series.default_value != null) {
                    this.http.post("getData", {
                        type: "faction",
                        id: this.selectGroup.series.default_value._id
                    }).then(function(response) {
                        this.selectGroup.faction = {
                            data: response.data
                        }
                    }.bind(this))

                    this.http.post("getData", {
                        type: "category",
                        id: this.selectGroup.series.default_value._id
                    }).then(function(response) {
                        this.selectGroup.category = {
                            data: response.data
                        }
                    }.bind(this))
                }
            },
            init: function() {
                this.http.post("getData", {
                    type: "series"
                }).then(function(response) {
                    this.selectGroup.series = {
                        data: response.data
                    }

                }.bind(this))
            },
            search: function(_newSearch) {

                if (typeof(_newSearch) != "undefined") {
                    this.currentPage = 0;
                    this.totalPageCount = 0;
                    this.totalItemCount = 0;
                }

                var searchQuery = {
                    type: "search",
                    pageshow: this.pageshow,
                    currentPage: this.currentPage
                }

                for (var key in this.selectGroup) {
                    searchQuery[key] = this.selectGroup[key].selected_value = (this.selectGroup[key].default_value == null) ? null : this.selectGroup[key].default_value._id;

                }

                searchQuery.keyword = this.keyword.selected_value = (this.keyword.default_value == "") ? null : this.keyword.default_value;

                this.http.post("getData", searchQuery).then(function(response) {
                    this.returnArmy = response.data.data;
                    this.totalItemCount = response.data.count;
                    this.totalPageCount = Math.floor(response.data.count / this.pageshow);
                    this.status_avg = response.data.status_avg



                    this.scope.searchReturn = response.data.data;

                    if (response.data.count % this.pageshow > 0) {
                        this.totalPageCount++;
                    }


                }.bind(this))


            },
            prev: function() {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.search();
                }


            },
            next: function() {
                if (this.currentPage < this.totalPageCount - 1) {
                    this.currentPage++;
                    this.search();
                }
            }
        }

        return itemSearch;


    })

    app.factory('radar', function() {

        var _data = []

        var _orignal_data = {
            className: 'hide', // optional can be used for styling
            axes: [{
                axis: "SPD",
                value: 1,
                yOffset: -10
            }, {
                axis: "STR",
                value: 1,
                yOffset: -10,
                xOffset: -10
            }, {
                axis: "MAT",
                value: 1,
                yOffset: 10,
                xOffset: -10
            }, {
                axis: "RAT",
                value: 1,
                yOffset: 10
            }, {
                axis: "DEF",
                value: 1,
                yOffset: 10,
                xOffset: 10
            }, {
                axis: "ARM",
                value: 1,
                yOffset: -10,
                xOffset: 10
            }]
        }

        _data.push(_orignal_data);

        var radarTemp = {
            data: _data,
            currentIndex: 0,
            orignal_data: _orignal_data,
            target: null,
            sample_data: null,
            render: function(target) {
                var _sData = this.transferData(this.sample_data, true);
                if (_sData) {
                    this.data.push(_sData);
                }
                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(target, this.data);
            },
            transferData: function(_data, _sample) {

                var _to = angular.copy(this.orignal_data);

                if (typeof(_sample) == "undefined") {
                    _to.className = "show";
                } else {
                    if (this.sample_data == null) {
                        return false;
                    }
                    _to.className = "hide";
                }


                for (var j = 0; j < _to.axes.length; j++) {
                    for (var key in _data) {
                        if (_to.axes[j].axis == key.toUpperCase()) {
                            _to.axes[j].value = _data[key];
                            break;
                        }
                    }
                }

                if (typeof(_sample) == "undefined") {
                    _to.className = "show";
                } else {
                    _to.className = "hide";
                }


                return _to;
            }
        }

        return radarTemp;



    })

    app.factory('editCtrl', function() {
        var editCtrl = {
            edit: false,
            numShow: "show_inline",
            inputShow: "hide",
            saveBtnShow: "hide",
            editBtnText: "Edit",
            currentStatus: {},
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
            editStatus: function(status) {

                if (this.edit == false) {
                    this.getStatusValue(status);
                    this.editMode(true);
                } else {
                    this.editMode(false);
                }
            },
            saveStatus: function() {
                console.log($http);
                // console.log(scope.currentSelectedUnit._id); 
               /* if (typeof(scope.currentSelectedUnit._id) == "undefined") {
                    return false;
                }

                scope.editCtrl.editMode(false);

                scope.currentSelectedUnit.status = scope.editCtrl.currentStatus;

                var _data = {
                    id: scope.currentSelectedUnit._id,
                    data: scope.editCtrl.currentStatus,
                    type: "save_status"
                }

                $http.post("getData", _data).then(function(response) {

                    var _d = [];

                    _d.push(scope.radar.transferData(scope.currentSelectedUnit.status));

                    scope.radar.data = _d;

                    scope.radar.render();

                }.bind(this))*/
            }

        }

        return editCtrl;


    })






})
