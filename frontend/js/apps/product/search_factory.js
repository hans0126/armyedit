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

})
