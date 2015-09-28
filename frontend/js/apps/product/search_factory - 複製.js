define(function(require) {

    var app = require("app");

    app.factory('search', ['$http', function($http) {

        itemSearch = {

            scope: null,
            pageshow: 9,
            currentPage: 0,
            totalPageCount: 0,
            totalItemCount: 0,
            returnArmy: [],
            selectGroup: {
                series: {

                    default_value: null,
                    selected_value: null
                },
                faction: {

                    default_value: null,
                    selected_value: null
                },
                category: {

                    default_value: null,
                    selected_value: null
                }
            },
            keyword: {
                default_value: "",
                selected_value: null
            },

            search: function(_newSearch) {

                var searchQuery = {
                    type: "search",
                    pageshow: this.pageshow
                }

                if (typeof(_newSearch) != "undefined") {
                    this.currentPage = 0;
                    this.totalPageCount = 0;
                    this.totalItemCount = 0;
                    for (var key in this.selectGroup) {
                        searchQuery[key] = this.selectGroup[key].selected_value = (this.selectGroup[key].default_value == null) ? null : this.selectGroup[key].default_value._id;

                    }

                    searchQuery.keyword = this.keyword.selected_value = (this.keyword.default_value == "") ? null : this.keyword.default_value;

                } else {
                    for (var key in this.selectGroup) {
                        searchQuery[key] = this.selectGroup[key].selected_value;

                    }

                    searchQuery.keyword = this.keyword.selected_value;
                }

                searchQuery["currentPage"] = this.currentPage;

                $http.post("getData", searchQuery).then(function(response) {
                    this.returnArmy = response.data.data;
                    this.totalItemCount = response.data.count;
                    this.totalPageCount = Math.floor(response.data.count / this.pageshow);

                    if (response.data.count % this.pageshow > 0) {
                        this.totalPageCount++;
                    }


                }.bind(this))
            },
            clear: function() {
                for (var key in this.selectGroup) {
                    this.selectGroup[key].default_value = null;
                }

                this.keyword = {
                    default_value: ""
                }
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
    }])

    app.factory('radar', function() {

        var _orignal_data = {
            className: 'hide', // optional can be used for styling
            axes: [{
                axis: "SPD",
                value: 100,
                yOffset: -10
            }, {
                axis: "STR",
                value: 100,
                yOffset: -10,
                xOffset: -10
            }, {
                axis: "MAT",
                value: 100,
                yOffset: 10,
                xOffset: -10
            }, {
                axis: "RAT",
                value: 100,
                yOffset: 10
            }, {
                axis: "DEF",
                value: 100,
                yOffset: 10,
                xOffset: 10
            }, {
                axis: "ARM",
                value: 100,
                yOffset: -10,
                xOffset: 10
            }]
        }

        var radarTemp = {
            data: [],
            currentIndex: 0,
            orignal_data: _orignal_data,
            target: null,
            sample_data: null,
            render: function(target) {

                this.data.push(this.orignal_data);

                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(target, this.data);
            },
            transferData: function(_data, _avg, _sample) {

                var _to = angular.copy(this.orignal_data);

                if (typeof(_sample) == "undefined") {
                    _to.className = "show";
                } else {
                    _to.className = "hide";
                }

                for (var j = 0; j < _to.axes.length; j++) {
                    for (var key in _data) {
                        //console.log(_avg);

                        if (_to.axes[j].axis == key.toUpperCase()) {
                            _to.axes[j].value = _data[key] * _avg[key];
                            break;
                        }
                    }
                }


                return _to;
            }
        }

        return radarTemp;



    })

    app.factory('editCtrl', function() {


        var editCtrl = {
            http: null,
            edit: false,
            numShow: "show_inline",
            inputShow: "hide",
            saveBtnShow: "hide",
            editBtnText: "Edit",
            currentStatus: {},
            category: [],
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

            }

        }

        return editCtrl;


    })

    app.factory('getStatusAvg', ['$http', function($http) {
        return $http.post("mapreduce", {
            type: "get_status"
        })
    }])








})
