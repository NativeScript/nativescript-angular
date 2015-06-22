import application = require("application");

import {Component, View, bootstrap, bind, Renderer, appComponentRefToken} from 'angular2/angular2';
import {Parse5DomAdapter} from 'angular2/src/dom/parse5_adapter';

Parse5DomAdapter.makeCurrent();

application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
