requirejs.config({
    baseUrl: 'js',

    paths: {
        angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min',
        angularMocks: 'https://code.angularjs.org/1.2.9/angular-mocks',
        directive: 'app/directive',
        controller: 'app/controller',
        factory: 'app/factory',
        main_app: 'app/main_app',
        d3: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min',
        d3_radar: 'lib/radar-chart-d3-master/src/radar-chart.min'


    },
    shim: {
        angular: {
            exports: 'angular'
        },
        d3_radar: {
            deps: ['d3'],
            exports: 'd3_radar'
        }

    }
});

// Start the main app logic.
requirejs(['main_app', 'angular'], function(app) {




});
