var profiling = require('./profiling');
profiling.start('application-start');

var application = require("application");
application.on(application.launchEvent, function() {
    //console.log('launched!');
    //profiling.stop('application-start');
});
application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
