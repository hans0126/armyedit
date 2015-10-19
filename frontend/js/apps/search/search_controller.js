define(function(require) {

    var app = require("app");

    app.controller("searchController", [
        "searchTypeService",
        "settingService",
        "searchData",
        function(searchTypeService, settingService,searchData) {

            var _self = this;
            //category
            _self.s = settingService;

            var pageshow = 9;
            var resetDataSample = {
                series: null,
                faction: null,
                category: null,
                keyword: null,
                ability: null,
                keywordLogic: "and"
            }

            _self.currentPage = 0;
            _self.totalPageCount = 0;
            _self.totalItemCount = 0;
            _self.searchResult = [];

            _self.searchType = searchTypeService;

            //ability

            //  _self.ability = abilityService;
            _self.tempAbility = [];
            _self.ablityActive = function(_ability) {
                if (_self.tempAbility.indexOf(_ability) > -1) {
                    return "active"
                }
            }
            _self.abilityModify = function(_obj) {
                var _idx = _self.tempAbility.indexOf(_obj);
                if (_idx > -1) {
                    _self.tempAbility.splice(_idx, 1);
                } else {
                    _self.tempAbility.push(_obj);
                }
            }


            _self.cssActive = function(_va) {
                if (_va) {
                    return "active"
                }
            }



            if (searchTypeService.searchType == "product") {
                _self.activeSearchBtn = true;
            } else {
                _self.activeSearchBtn = false;
            }

            _self.changeSearchtType = function(_va) {

                if (searchTypeService.searchType == _va) {
                    return false;
                }

                _self.searchResult = [];

                searchTypeService.searchType = _va;

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
                        searchType: searchTypeService.searchType
                    }

                    for (var _key in _self.selectGroup) {
                        searchQuery[_key] = _self.selectGroup[_key];
                    }
                    //tip selected record
                    _self.selectedRecord = angular.copy(searchQuery);

                    searchQuery.ability = _self.tempAbility;

                } else {
                    searchQuery = _self.selectedRecord;
                }

                searchQuery["currentPage"] = _self.currentPage;

                var _d = {
                    type: "search",
                    datas: searchQuery
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
                _self.tempAbility = [];
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

    app.service('searchTypeService', function() {
        this.searchType = null;

    })


})
