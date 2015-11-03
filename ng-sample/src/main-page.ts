import {topmost} from 'ui/frame';
import {TextView} from 'ui/text-view';

import {nativeScriptBootstrap} from 'nativescript-angular/application';
import {RendererTest} from './renderer-test';
import {Benchmark} from './benchmark';


//TODO: move to an angular init module/base page class
export function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = "";

    console.log('BOOTSTRAPPING...');
    nativeScriptBootstrap(Benchmark, []).then((appRef) => {
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
