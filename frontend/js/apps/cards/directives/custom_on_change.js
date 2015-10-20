define(function(require) {

    var app = require("app");

    app.directive('customOnChange', function() {
        return {
            restrict: 'A',
            scope: {
                thumbImg: "=",
                imgFile: "="
            },
            link: function(scope, element, attrs) {
                // get function and bind change Event
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            },
            controller: function($scope) {
                // tips : define function in controller  , directive use this function 

                $scope.uploadFile = function() {

                    var _file = event.target.files[0];
                    var _fileType = _file.type;
                    _fileType = _fileType.split("/");
                    $scope.imgFile = _file;
                    if (_fileType[0] != "image") {
                        $scope.imgFile = null;
                        console.log("file format error!!");
                        return false;
                    }

                    var filename = _file.name;

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $scope.thumbImg = e.target.result;
                        $scope.$apply();
                        //   _t.init($scope.thumb, e.target.result, $scope.thumbs);
                    };
                    reader.readAsDataURL(event.target.files[0]);
                };

            }
        };
    });

})
