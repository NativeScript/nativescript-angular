import {HelloWorldModel} from "./main-view-model";

var viewModel = new HelloWorldModel();

export function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = viewModel;
}
