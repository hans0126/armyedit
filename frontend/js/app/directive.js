define(['d3', 'd3_radar'], function(d3, radar) {

    function itemSearch($compile, $http) {

        var itemSearch = {
            pageshow: 9,
            currentPage: 0,
            totalPageCount: 0,
            totalItemCount: 0,
            returnArmy: [],
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
            seriesSelect: function() {
                if (this.selectGroup.series.default_value != null) {

                    $http.post("getData", {
                        type: "faction",
                        id: this.selectGroup.series.default_value._id
                    }).then(function(response) {
                        this.selectGroup.faction = {
                            data: response.data
                        }
                    }.bind(this))

                    $http.post("getData", {
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
                $http.post("getData", {
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

                $http.post("getData", searchQuery).then(function(response) {
                    this.returnArmy = response.data.data;
                    this.totalItemCount = response.data.count;
                    this.totalPageCount = Math.floor(response.data.count / this.pageshow);
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

        return {
            restrict: 'A',
            link: function(scope, element, attr) {


                scope.itemSearch = itemSearch;

                scope.itemSearch.init();

                scope.$watch("itemSearch.returnArmy", function(_new) {

                    if (_new.length > 0) {
                        scope.itemSelect.selectDisable = false;

                    }
                })

            },
            templateUrl: 'template/select_area.html'
        }

    }

    function imageonload($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    console.log("err");
                    var html = '<img src="http://fakeimg.pl/120x120/?text=img&font=lobster"/>';
                    var e = $compile(html)(scope);
                    element.replaceWith(e);
                });
            }
        };
    }

    function itemSelect($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var _r = angular.element(element[0].getElementsByClassName('imgArea'));

                _r.bind('click', function() {

                    switch (scope.itemSelect.selectMode) {

                        case "multiple_select":


                            var _i = this.find('i');
                            if (!this.hasClass('hasSelected')) {



                                if (scope.itemSelect.selected.indexOf(element.attr('_id')) == -1) {
                                    scope.itemSelect.selected.push(element.attr('_id'));

                                    for (var i = 0; i < scope.itemSearch.returnArmy.length; i++) {
                                        if (scope.itemSearch.returnArmy[i]._id == element.attr('_id')) {
                                            scope.itemSelect.selectedArmy.push(scope.itemSearch.returnArmy[i]);
                                        }
                                    }

                                }

                            } else {

                                scope.itemSelect.selected.splice(scope.itemSelect.selected.indexOf(element.attr('_id')), 1);

                                for (var i = 0; i < scope.itemSelect.selectedArmy.length; i++) {

                                    if (scope.itemSelect.selectedArmy[i]._id == element.attr('_id')) {
                                        scope.itemSelect.selectedArmy.splice(i, 1);
                                    }
                                }


                            }

                            scope.itemSelect.combineSelectToreturnArmy();
                            scope.$apply()
                            break;

                        case "detail":

                            for (var i = 0; i < scope.itemSearch.returnArmy.length; i++) {
                                if (scope.itemSearch.returnArmy[i]._id == element.attr('_id')) {

                                    scope.$parent.currentSelectedUnit = scope.itemSearch.returnArmy[i];

                                    if (typeof(scope.itemSearch.returnArmy[i].status) != "undefined") {


                                        var _data = [];

                                        _data.push(scope.radar.transferData(scope.itemSearch.returnArmy[i].status));

                                        scope.radar.data = _data;

                                        scope.radar.render();

                                    }

                                    scope.$apply();


                                }
                            }

                            break;

                    }



                }.bind(_r))


            }
        }
    }

    function productList($compile, dataTemplates) {
        return {
            restrict: 'A',
            templateUrl: dataTemplates.imgList
        }
    }

    function subContent($compile, dataTemplates, $http, $templateCache, $parse) {

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                /* scope.getContentUrl = function() {
                     return dataTemplates[scope.testChange];
                 }*/
            }

        }
    }

    function radar() {



        var _data = []

        var _orignal_data = {
            className: 'germany', // optional can be used for styling
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



        var radar_chart = {
            data: _data,
            currentIndex: 0,
            orignal_data: _orignal_data,
            target: null,
            render: function() {
                RadarChart.defaultConfig.w = 300;
                RadarChart.defaultConfig.h = 300;
                RadarChart.draw(this.target, this.data);
            },
            transferData: function(_data) {

                var _to = angular.copy(this.orignal_data);

                for (var j = 0; j < _to.axes.length; j++) {
                    for (var key in _data) {
                        if (_to.axes[j].axis == key.toUpperCase()) {
                            _to.axes[j].value = _data[key];
                            break;
                        }
                    }
                }

                return _to;

            }
        }


        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var _scope = scope.$parent;


                _scope.radar = radar_chart;
                _scope.radar.target = element[0];
                _scope.radar.render();


            }

        }
    }

    function detailStatus() {

        var editCtrl = {
            edit: false,
            numShow: "show_inline",
            inputShow: "hide",
            editBtnText:"Edit",
            currentStatus: {},
            getStatusValue: function(_data) {              
                for (var key in _data) {
                    this.currentStatus[key] = _data[key];
              
                }
            }
        }


        return {
            restrict: 'A',
            link: function(scope) {

                scope.editCtrl = editCtrl;


                scope.editStatus = function() {                 


                    if (scope.editCtrl.edit == false) {

                        scope.editCtrl.getStatusValue(scope.currentSelectedUnit.status);                     

                        scope.editCtrl.edit = true;
                        scope.editCtrl.numShow = "hide";
                        scope.editCtrl.inputShow = "show_inline";
                        scope.editCtrl.editBtnText ="Cancel";

                    } else {
                        scope.editCtrl.edit = false;
                        scope.editCtrl.numShow = "show_inline";
                        scope.editCtrl.inputShow = "hide";
                        scope.editCtrl.editBtnText = "Edit";
                    }
                }
            }
        }
    }



    return {
        itemSearch: itemSearch,
        imageonload: imageonload,
        itemSelect: itemSelect,
        productList: productList,
        subContent: subContent,
        radar: radar,
        detailStatus: detailStatus

    }
});
