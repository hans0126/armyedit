requirejs.config({
    baseUrl: 'js',
    paths: {
        angular: 'lib/angular.min',
        angularMocks: 'lib/angular-mocks',
        angularRoute: 'lib/angular-route.min',
        angularAnimate: 'lib/angular-animate.min',
        angularAMD: 'lib/angularAMD.min',
        d3: 'lib/d3.min',
        d3_radar: 'lib/radar-chart-d3-master/src/radar-chart.min',
        app: 'apps/module/main_module'

    },
    shim: {
        angularAMD: {
            deps: ['angular']
        },
        angularAnimate: {
            deps: ['angularAMD']
        },
        angularRoute: {
            deps: ['angularAnimate']
        },
        app:{
             deps: ['angularRoute','d3_radar']
        },
        d3_radar: {
            deps: ['d3']
        }
    },
    deps:['apps/app_config']
});



