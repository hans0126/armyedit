requirejs.config({
    baseUrl: 'js',

    paths: {
        angular: 'lib/angular.min',
        angularMocks: 'lib/angular-mocks',
        angularRoute: 'lib/angular-route.min',
        angularAnimate:'lib/angular-animate.min',
        angularAMD: 'lib/angularAMD.min',
        d3: 'lib/d3.min',
        d3_radar: 'lib/radar-chart-d3-master/src/radar-chart.min',
        app: 'apps/module/main_module'

    },
    shim: {
        angular: {
            exports: 'angular'
        },
        angularAMD: {
            deps: ['angular']
        },
        angularAnimate:{
            deps: ['angularAMD']
        },
        angularRoute: {
            deps: ['angularAnimate']
        },
        d3_radar: {
            deps: ['d3']
        }
    },
    deps: ['angularRoute',
        'd3_radar',
        'apps/init/status-avg_service',
        'apps/init/get-category_service',
        'apps/init/main_controller',
        'apps/product/search_factory',
        'apps/product/product-detail_factory',
        'apps/product/radar_factory',
        'apps/filter/highlight_filter',
        'apps/directive/image-onload_directive',
        'apps/search/search_controller',
        'apps/app_config'
    ]
});
