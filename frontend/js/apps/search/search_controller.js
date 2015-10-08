define(function(require) {

    var app = require("app");

    app.controller("search_controller", [
        "statusAvgService",
        "radarFactory",
        "getCategoryService",
        "searchData",
        function(statusAvgService, radarFactory, getCategoryService, searchData) {

            var _self = this;
            //category
            _self.c = getCategoryService;

            var pageshow = 9;
            var resetDataSample = {
                series: null,
                faction: null,
                category: null,
                keyword: null,
                keywordLogic: "and"
            }

            _self.currentPage = 0;
            _self.totalPageCount = 0;
            _self.totalItemCount = 0;
            _self.searchResult = [];

            _self.searchType = "products";

            _self.cssActive = function(_va) {
                if (_va) {
                    return "active"
                }
            }

            _self.activeSearchBtn = true;

            _self.changeSearchtType = function(_va) {
                
                if(_self.searchType==_va){
                    return false;
                }

                _self.searchType = _va;
                _self.activeSearchBtn = !_self.activeSearchBtn
            }

            _self.selectGroup = angular.copy(resetDataSample);

            _self.search = function(_newSearch) {

                var searchQuery = {}
                    // if new search
                if (typeof(_newSearch) != "undefined") {
                    _self.currentPage = 0;
                    _self.totalPageCount = 0;
                    _self.totalItemCount = 0;

                    searchQuery = {
                      
                        pageshow: pageshow,
                        searchType:_self.searchType
                    }

                    for (var _key in _self.selectGroup) {
                        searchQuery[_key] = _self.selectGroup[_key];
                    }
                    //tip selected record
                    _self.selectedRecord = angular.copy(searchQuery);

                } else {
                    searchQuery = _self.selectedRecord;
                }

                searchQuery["currentPage"] = _self.currentPage;

                var _d = {
                    type:"search",
                    datas:searchQuery
                }

                searchData(_d).then(function(response) {
                    _self.searchResult = response.data.data;
                    _self.totalItemCount = response.data.count;
                    _self.totalPageCount = Math.floor(response.data.count / pageshow);

                    if (response.data.count % pageshow > 0) {
                        _self.totalPageCount++;
                    }

                })

            }
            _self.clear = function() {
                  _self.selectGroup = angular.copy(resetDataSample);
            }
            _self.prev = function() {
                if (_self.currentPage > 0) {
                    _self.currentPage--;
                    _self.search();
                }
            }
            _self.next = function() {
                if (this.currentPage < this.totalPageCount - 1) {
                    this.currentPage++;
                    this.search();
                }
            }


        }
    ])

    app.factory("searchData", ["$http", function($http) {

        function search(_data) {
            return $http.post("getData", _data)
        }

        return search

    }])


})
