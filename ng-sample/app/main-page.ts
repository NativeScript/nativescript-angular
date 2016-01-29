import * as profiling from "./performance/profiling";
import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';
import {Page} from 'ui/page';

import {bootstrap} from './nativescript-angular/application';
// import {Benchmark} from './performance/benchmark';
// import {RendererTest} from './examples/renderer-test';
// import {ListTest} from './examples/list/list-test';
// import {ListTestAsync} from './examples/list/list-test-async';
import {ImageTest} from './examples/image/image-test';

export function createPage() {
    var page = new Page();

    page.on('loaded', function() {
        profiling.stop('application-start');
        console.log('Page loaded');

        profiling.start('ng-bootstrap');
        console.log('BOOTSTRAPPING...');
        //bootstrap(Benchmark, []).then((appRef) => {
        // bootstrap(RendererTest, []).then((appRef) => {
        //bootstrap(ListTest, []).then((appRef) => {
        //bootstrap(ListTestAsync, []).then((appRef) => {
        bootstrap(ImageTest, []).then((appRef) => {
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
