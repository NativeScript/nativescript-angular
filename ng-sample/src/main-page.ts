import * as profiling from "./profiling";
import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';

import {nativeScriptBootstrap} from './nativescript-angular/application';
import {RendererTest} from './renderer-test';
import {Benchmark} from './benchmark';


//TODO: move to an angular init module/base page class
export function pageLoaded(args) {
    profiling.stop('application-start');

    var page = args.object;
    page.bindingContext = "";

    profiling.start('ng-bootstrap');
    console.log('BOOTSTRAPPING...');
    //nativeScriptBootstrap(Benchmark, []).then((appRef) => {
    nativeScriptBootstrap(RendererTest, []).then((appRef) => {
        profiling.stop('ng-bootstrap');
        console.log('ANGULAR BOOTSTRAP DONE.');
    }, (err) =>{
        console.log('ERROR BOOTSTRAPPING ANGULAR');
        let errorMessage = err.message + "\n\n" + err.stack;
        console.log(errorMessage);

        let view = new TextView();
        view.text = errorMessage;
        topmost().currentPage.content = view;
    });
}
