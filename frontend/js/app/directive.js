define([], function() {

    function itemSearch($compile, $http) {

        var itemSearch = {
            pageshow: 10,
            currentPage: 0,
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
            search: function() {
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
                    // scope.itemSelect.combineSelectToreturnArmy();

                }.bind(this))
            }
        }

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                scope.itemSearch = itemSearch;

                scope.itemSearch.init();

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
                    var html = '<div class="no_img">I should not be red</div>';
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

                    if (!scope.itemSelect.selectMode) {
                        return false
                    };

                    var _i = this.find('i');
                    if (!this.hasClass('hasSelected')) {

                        if (scope.itemSelect.selected.indexOf(element.attr('_id')) == -1) {
                            scope.itemSelect.selected.push(element.attr('_id'));

                            for (var i = 0; i < scope.returnArmy.length; i++) {
                                if (scope.returnArmy[i]._id == element.attr('_id')) {
                                    scope.itemSelect.selectedArmy.push(scope.returnArmy[i]);
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

    function selectedList($compile, dataTemplates, $http, $templateCache, $parse) {

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                scope.getContentUrl = function() {
                    return dataTemplates[scope.testChange];
                }
            },
            template: '<div ng-include="getContentUrl()"></div>'

        }
    }

    return {
        itemSearch: itemSearch,
        imageonload: imageonload,
        itemSelect: itemSelect,
        productList: productList,
        selectedList: selectedList
    }
});
