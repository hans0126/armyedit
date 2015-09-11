define([], function() {



    function main($scope, $http, $sce) {

        var pageshow = 10;
        var currentPage = 0;

        $scope.returnArmy = [];

        $scope.$watch("returnArmy", function(_new) {
            if (_new.length > 0) {
                $scope.itemSelect.selectDisable = false;
            }
        })

        $scope.testChange = "test";

        $scope.itemSelect = {
            selectMode: false,
            selectDisable: true,
            selectClass: "",
            selectText: "select",
            selected: [],
            selectedArmy: [],
            selectTrigger: function() {

                if (this.selectMode == false) {
                    this.selectMode = true;
                    this.selectClass = "selectOn";
                    this.selectText = "cancel";
                    $scope.testChange = "selectedList";
                } else {
                    this.selectMode = false;
                    this.selectClass = "";
                    this.selectText = "select";
                    $scope.testChange = "test";
                }
            },
            combineSelectToreturnArmy: function() {

                for (var i = 0; i < $scope.returnArmy.length; i++) {
                    //init value
                    $scope.returnArmy[i].hasSelect = '';
                    $scope.returnArmy[i].icon = '';
                    for (var j = 0; j < this.selected.length; j++) {
                        if ($scope.returnArmy[i]._id == this.selected[j]) {

                            $scope.returnArmy[i].hasSelect = 'hasSelected';
                            $scope.returnArmy[i].icon = 'fa-check-circle-o';
                            break;
                        }

                    }

                    if ($scope.returnArmy[i].hasSelect == '') {
                        $scope.returnArmy[i].hasSelect = '';
                        $scope.returnArmy[i].icon = 'fa-circle-o';
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
                            title: "col-xs-12"
                        }

                        break;

                    case "dataList":
                        $scope.itemDisplay = {
                            row: "col-xs-12",
                            img: "col-xs-4",
                            title: "col-xs-8"
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
            title: "col-xs-12"
        }
    }


    return {
        main:main
    }



})
