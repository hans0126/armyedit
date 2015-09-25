requirejs.config({
    baseUrl: 'js',

    paths: {
        angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min',
        angularMocks: 'https://code.angularjs.org/1.2.9/angular-mocks',
        angularRoute: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.5/angular-route.min',
        angularAMD :'http://cdn.jsdelivr.net/angular.amd/0.2/angularAMD.min',            
        d3: 'lib/d3.min',
        d3_radar: 'lib/radar-chart-d3-master/src/radar-chart.min',
        app: 'apps/module/main_module'

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
        d3_radar: {
            deps: ['d3']
        }
    },
    deps:['angularRoute',
            'd3_radar',
            'apps/factory/search_factory',
            'apps/directive/radar_directive',
            'apps/controller/radar_controller',
            'apps/init/status-avg_service',
            'apps/init/get-category_service',
            'apps/init/main_controller',
            'apps/product/search_factory',
            'apps/app_config']
});

