var tests = [];
/**
 * This will push the tests into an array so we can include it below
 *
 * also, some dependencies were gracious enough to leave their spec files in here, so we have to be pretty
 * specific with the regex otherwise you will start including other tests too.
 *
 * Naming convention for the files are
 *      (moduleName).spec.js
 */
for (var file in window.__karma__.files) {
    if (/test\/specs\/[A-Za-z.\s_-]+\.spec\.js$/.test(file)) {
        tests.push(file.replace(/^\/base\//, "/base/"));
    }
}

/**
 * This is a require config that works only on karma testing!
 *
 * For some reason, karma will throw all your dependencies in /base/ so i just made this config file
 */
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: "/base/",
    paths: {
        /** Following must have their names preserved **/
        "jquery": "libs/managed/jquery/dist/jquery",
        "underscore": "libs/managed/underscore/underscore",
        "underscore.string": "libs/managed/underscore.string/dist/underscore.string",

        /** Standard libraries **/
        "async": "libs/managed/requirejs-plugins/src/async",
        "backbone": "libs/managed/backbone/backbone",
        "marionette": "libs/managed/marionette/lib/backbone.marionette",
        "text": "libs/managed/text/text",
        "bossview": "libs/managed/bossview/Marionette.BossView.AMD",
        "cocktail": "libs/managed/cocktail/Cocktail",
        "moment": "libs/managed/moment/moment",
        "simpleStorage": "libs/managed/simpleStorage/simpleStorage",
        "backbonedeep": "libs/managed/backbone-deep-model/distribution/deep-model",
        "cache": "libs/managed/backbone-fetch-cache/backbone.fetch-cache",
        "queryparams": "libs/managed/backbone-query-parameters/backbone.queryparams",
        "bootstrap": "libs/managed/bootstrap/dist/js/bootstrap.min",
        "toastr": "libs/managed/toastr/toastr",
        "countUp": "libs/managed/countup.js/countUp",
        "dropZone": "libs/managed/dropzone/dist/dropzone-amd-module",
        "tetherjs": "libs/managed/tether/dist/js/tether.min",
        "backbone.radio": "libs/managed/backbone.radio/build/backbone.radio",
        "typed": "libs/managed/typed.js/dist/typed.min",
        "jqTree": "libs/managed/jqTree/tree.jquery",
        "perfectScrollbar": "libs/managed/perfect-scrollbar/js/perfect-scrollbar.jquery.min",
        "jquery-ui": "libs/managed/jquery-ui/jquery-ui.min",

        "modals": "libs/managed/backbone-modal/backbone.modal",
        "tooltips": "libs/managed/backbone-tooltip/src/backbone-tooltip.amd",

        "app": "app/app",
        "routeRegistration": "app/route-registration",
        "modalRegistration": "app/modal-registration"
    },
    shim: {

        simplebar: {
            deps: ["jquery"]
        },

        dropZone: {
            deps: ["jquery"]
        },

        countUp: {
            exports: "CountUp"
        },

        "underscore.string": {
            deps: ["underscore"]
        },

        toastr: {
            deps: ["jquery"]
        },

        tetherjs: {
            deps: ["jquery"],
            exports: "Tether"
        },

        bootstrap: {
            deps: ["tetherjs", "jquery"]
        },

        modals: {
            deps: ["marionette"]
        },

        cache: {
            deps: ["backbone"]
        },

        queryparams: {
            "deps": ["backbone"]
        },

        backbone: {
            "deps": ["underscore", "jquery"],
            "exports": "backbone"
        },

        backbonedeep: {
            "deps": ["underscore", "backbone"],
            "exports": "backbone"
        },

        marionette: {
            "deps": ["underscore", "backbone", "jquery", "backbonedeep"],
            "exports": "marionette"
        },

        bossview: {
            "deps": ["marionette"]
        }

    },

    /**
     * Ask Require.js to load these files (all our tests)
     */
    deps: tests,

    /**
     * Start test run, once Require.js is done
     */
    callback: window.__karma__.start
});

/**
 * Tether doesn't expose itself globally, so we will force it to.
 */
require(["tetherjs"], function(Tether) {
    /**
     * We need to attach Tether to the global scope as Bootstrap looks in the global scope for tether
     */
    window.Tether = Tether;
});

/**
 * Setup and start the app.
 */
require(["app", "routeRegistration", "modalRegistration", "cache"], function (App, RouteRegistration, ModalRegistration){

    /**
     * We're going to create an element and then give it the class .app
     */
    var el = window.document.createElement("div");

    el.className = "app";

    /**
     * Setup the router for the application
     */
    var Router = Backbone.Marionette.AppRouter.extend({});
    App.router = new Router();
    RouteRegistration.forEach(function(aRouteController){
        App.router.processAppRoutes(aRouteController, aRouteController.appRoutes);
    });

    /**
     * When the app initializes, we are going to start Backbones history engine
     */
    App.on("start", function() {
        /** If Backbone cannot find a route, redirect to the 404 page **/
        if (!Backbone.history.start()){
            /** 404 handler here **/
        }

    });

    /** ...and away we go! **/
    App.start();

});