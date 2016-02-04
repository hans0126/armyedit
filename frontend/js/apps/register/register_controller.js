define(function(require) {

    var app = require("app");


    app.controller("register_controller", ["$scope",
        "settingService",
        "registerService",
        function($scope, settingService, registerService) {
            //console.log(registerService.aa);

            var _self = this;


            _self.defaultVal = {};
            _self.user = {}

            _self.reset = function() {
                _self.user = angular.copy(_self.defaultVal);
            }

            _self.reset();

            registerService.getToken(function(re) {

              

                if (re.newUser) {
                    _self.user.userName = re.name;
                    _self.user.email = re.email;
                }
            });


            _self.update = function() {
                _self.defaultVal = angular.copy(_self.user);
                registerService.userUpdate(_self.defaultVal);
            }

        }
    ])

    app.directive("checkMail", ["$http", function($http) {

        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                //  console.log(ctrl.$validators.email);

                ctrl.$validators.checkMail = function(modelValue, viewValue) {

                    if (!ctrl.$isEmpty(modelValue) && ctrl.$validators.email(modelValue)) {
                        // consider empty models to be valid

                        $http.post('/check_mail', {
                            mail: modelValue
                        }).then(function(re) {
                            if (re.data) {
                                return true;
                            } else {
                                return false;
                            }
                        }, function() {
                            console.log("check mail error")
                        })


                    }


                    //return false;
                }
            }
        }
    }])

})
