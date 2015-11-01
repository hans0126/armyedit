define(function(require) {

    var app = require("app");

    app.directive("abilityEdit", function($rootScope) {

        return {
            restrict: 'A',
            scope: {
                ability: "=abilityEdit",
                currentActor: "=currentActor"
            },
            link: function(scope, element, attr) {
                scope.mapping = [];
                if (scope.currentActor.characterAbility) {
                    for (var i = 0; i < scope.currentActor.characterAbility.length; i++) {
                        scope.mapping.push(scope.ability.mapping[scope.currentActor.characterAbility[i]]);
                    }
                }
                scope.addAbility = function() {
                    scope.popupShow = !scope.popupShow;
                    if (scope.popupShow) {
                        scope.buttonText = "Apply";
                    } else {
                        scope.buttonText = "Edit Ability";
                    }
                }

                scope.modify = function(_ability) {
                    if (!scope.currentActor.characterAbility) {
                        scope.currentActor.characterAbility = [];
                    }

                    var _idx = scope.currentActor.characterAbility.indexOf(_ability._id);

                    if (_idx > -1) {
                        scope.currentActor.characterAbility.splice(_idx, 1);
                        scope.mapping.splice(_idx, 1);
                    } else {
                        scope.currentActor.characterAbility.push(_ability._id);
                        scope.mapping.push(_ability);
                    }
                }

                scope.active = function(_ability) {
                    if (scope.currentActor.characterAbility) {
                        if (scope.currentActor.characterAbility.indexOf(_ability) > -1) {
                            return "active"
                        }
                    }
                }

                scope.clear = function() {
                    scope.currentActor.characterAbility = [];
                    scope.mapping = [];
                }

                scope.buttonText = "Edit Ability";

                scope.popupShow = false;
            },
            templateUrl: "js/apps/cards/directives/ability_edit.html"
        }

    })
})
