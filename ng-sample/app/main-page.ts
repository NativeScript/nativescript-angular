import * as profiling from "./profiling";
import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';
import {Page} from 'ui/page';

import {nativeScriptBootstrap} from './nativescript-angular/application';
// import {RendererTest} from './renderer-test';
//import {Benchmark} from './benchmark';
import {ListTest} from './list-test';

export function createPage() {
    var page = new Page();

    page.on('loaded', function() {
        profiling.stop('application-start');
        console.log('Page loaded');

        profiling.start('ng-bootstrap');
        console.log('BOOTSTRAPPING...');
        //nativeScriptBootstrap(Benchmark, []).then((appRef) => {
        // nativeScriptBootstrap(RendererTest, []).then((appRef) => {
        nativeScriptBootstrap(ListTest, []).then((appRef) => {
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
    });
    return page;
}
