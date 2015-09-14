define([], function() {



    function main($scope, $http, $sce, dataTemplates) {



        $scope.testChange = "detail";

        $scope.getContentUrl = function() {
            return dataTemplates[$scope.testChange];
        }

        $scope.getContentUrl();

        $scope.currentSelectedUnit = {};
        // select mode  1: multiple select = multiple_select 2. radar = radar
        // if multiple select  they has  selectStart {boolean}


        $scope.itemSelect = {
            selectMode: "detail",
            selectStart: false,
            selectDisable: true,
            selectClass: "",
            selectText: "select",
            selected: [],
            selectedArmy: [],
            selectTrigger: function() {


                switch (this.selectMode) {
                    case "detail":

                        this.selectMode = "multiple_select";
                        this.selectClass = "selectOn";
                        this.selectText = "cancel";


                        break;

                    case "multiple_select":
                        this.selectClass = "";
                        this.selectText = "select";
                        this.selectMode = "detail";


                        break;
                }


            },
            combineSelectToreturnArmy: function() {


                for (var i = 0; i < $scope.itemSearch.returnArmy.length; i++) {
                    //init value
                    $scope.itemSearch.returnArmy[i].hasSelect = '';
                    $scope.itemSearch.returnArmy[i].icon = '';
                    for (var j = 0; j < this.selected.length; j++) {
                        if ($scope.itemSearch.returnArmy[i]._id == this.selected[j]) {

                            $scope.itemSearch.returnArmy[i].hasSelect = 'hasSelected';
                            $scope.itemSearch.returnArmy[i].icon = 'fa-check-circle-o';
                            break;
                        }

                    }

                    if ($scope.itemSearch.returnArmy[i].hasSelect == '') {
                        $scope.itemSearch.returnArmy[i].hasSelect = '';
                        $scope.itemSearch.returnArmy[i].icon = 'fa-circle-o';
                    }
                }
            }
        };

        $scope.dataDisplayBtn = {
            displayType: 0, //0:img , 1:data
            displayBtn: {
                imgList: true,
                dataList: false
            },

            changeType: function(_current) {

                switch (_current) {
                    case "imgList":

                        $scope.itemDisplay = {
                            row: "col-xs-4",
                            img: "col-xs-12",
                            title: "col-xs-12",
                            status: "hide"

                        }

                        break;

                    case "dataList":
                        $scope.itemDisplay = {
                            row: "col-xs-12",
                            img: "col-xs-4",
                            title: "col-xs-8",
                            status: "show"
                        }
                        break;
                }

                for (var _key in this.displayBtn) {
                    if (_current == _key) {
                        this.displayBtn[_key] = true;
                    } else {
                        this.displayBtn[_key] = false;
                    }
                }

            }
        };


        $scope.itemDisplay = {
            row: "col-xs-4",
            img: "col-xs-12",
            title: "col-xs-12",
            status: "hide"
        }
    }





    return {
        main: main
    }



})
