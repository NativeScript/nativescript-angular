var profiling = require('./profiling');
profiling.start('application-start');

var reflectMetadata = require("reflect-metadata");
var global = require("globals");
var page = require("ui/page");
console.log('page module: ' + page);

var application = require("application");
application.on(application.launchEvent, function() {
    //console.log('launched!');
    //profiling.stop('application-start');
});

var moduleLoader = require("utils/module-loader");
moduleLoader.registerModule("./main-page", function () { return require("./main-page"); });

application.mainModule = "./main-page";
application.cssFile = "./app.css";
application.start();
