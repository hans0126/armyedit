requirejs.config({
    baseUrl: 'js',

    paths: {
        angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min',
        angularMocks: 'https://code.angularjs.org/1.2.9/angular-mocks',
        directive: 'app/directive',
        controller: 'app/controller',
        factory: 'app/factory',
        main_app: 'app/main_app'

    },
    shim: {
        angular: {
            exports: 'angular'
        }

    }
});

// Start the main app logic.
requirejs(['main_app', 'angular'], function(app) {

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myApp']);
    })



});
