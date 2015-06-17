import {HelloWorldModel} from "./main-view-model";

import 'reflect-metadata';
import {
    Component,
    View,
    Ancestor,
    Inject,
    Injectable,
    Binding,
    forwardRef,
} from 'angular2/angular2';
 
console.log('ANGULAR TEST');
console.log(Component);

var viewModel = new HelloWorldModel();

export function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = viewModel;
}
