requirejs.config({
    baseUrl: 'js',

    paths: {
        angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min',
        angularMocks: 'https://code.angularjs.org/1.2.9/angular-mocks',
        angularRoute: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.5/angular-route.min',
        angularAMD :'http://cdn.jsdelivr.net/angular.amd/0.2/angularAMD.min',
        directive: 'app/directive',          
        d3: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min',
        d3_radar: 'lib/radar-chart-d3-master/src/radar-chart.min',
        app: 'apps/module/main_module',
        main_app: 'apps/main_app'



    },
    shim: {
        angular: {
            exports: 'angular'
        },
        angularAMD:{
            deps: ['angular']
        },
        angularRoute: {
            deps: ['angularAMD']
        },
        main_app: {
            deps: ['angularRoute','d3_radar']
        },
        d3_radar: {
            deps: ['d3']
        }
    },
    deps:['main_app']
});

