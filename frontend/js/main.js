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
        pixi: 'lib/pixi.min',
        pixi_bannerCreater: 'lib/pixi_banner_creater.min',
        pixi_warjack: "lib/pixi_warjack_box.min",
        app: 'apps/app'

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
        app: {
            deps: ['angularRoute', 'd3_radar', 'pixi_bannerCreater', 'pixi_warjack']
        },
        d3_radar: {
            deps: ['d3']
        },
        pixi_bannerCreater: {
            deps: ['pixi']
        }
    }

});

require(['apps/app_config'], function(app) {

    var loader = PIXI.loader;
    loader.add("images/source/satellite.fnt");
    loader.add("images/source/templar.fnt");
    loader.add("images/source/flag_pixi.json");

    loader.load();

})





window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();
