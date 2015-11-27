import * as profiling from "./profiling";
profiling.start('application-start');
import application = require("application");

//TODO: hide this in a separate module e.g. "angular-application"
application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
