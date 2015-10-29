define(function(require) {

    var app = require("app");

   

    app.controller("searchController", [
        "searchTypeService",
        "settingService",
        "searchData",
        function(searchTypeService, settingService, searchData) {

            var _self = this;

            var pageshow = 9;

            var resetDataSample = {
                series: null,
                faction: null,
                category: null,
                keyword: null,
                ability: null,
                keywordLogic: "and"
            }

            _self.s = settingService;

            _self.searchTemplateUrl = 'js/apps/search/controllers/search_area.html';
            _self.resultTemplateUrl = 'js/apps/search/controllers/search_result.html';

            _self.currentPage = 0;
            _self.totalPageCount = 0;
            _self.totalItemCount = 0;
            _self.searchResult = [];

            _self.searchType = searchTypeService;

            _self.tempAbility = [];
            _self.ablityActive = ablityActive;
            _self.abilityModify = abilityModify;
            _self.cssActive = cssActive;

            _self.changeSearchtType = changeSearchtType;
            _self.search = search;
            _self.clearData = clearData;
            _self.goPrev = goPrev;
            _self.goNext = goNext;

            if (searchTypeService.searchType == "product") {
                _self.activeSearchBtn = true;
            } else {
                _self.activeSearchBtn = false;
            }

            function ablityActive(_ability) {
                if (_self.tempAbility.indexOf(_ability) > -1) {
                    return "active"
                }
            }

            function abilityModify(_obj) {
                var _idx = _self.tempAbility.indexOf(_obj);
                if (_idx > -1) {
                    _self.tempAbility.splice(_idx, 1);
                } else {
                    _self.tempAbility.push(_obj);
                }
            }

            function cssActive(_va) {
                if (_va) {
                    return "active"
                }
            }

            function changeSearchtType(_va) {

                if (searchTypeService.searchType == _va) {
                    return false;
                }

                _self.searchResult = [];

                searchTypeService.searchType = _va;

                _self.activeSearchBtn = !_self.activeSearchBtn
            }

            _self.selectGroup = angular.copy(resetDataSample);

            function search(_newSearch) {

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

            function clearData() {                
                _self.selectGroup = angular.copy(resetDataSample);
                _self.tempAbility = [];
            }

            function goPrev() {

                if (_self.currentPage > 0) {
                    _self.currentPage--;
                    search();
                }
            }

            function goNext() {
                if (_self.currentPage < _self.totalPageCount - 1) {
                    _self.currentPage++;
                    search();
                }
            }
        }
    ])
})
