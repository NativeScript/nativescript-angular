import { Component } from "@angular/core";

import { FirstComponentActionBar } from "./action-bar/action-bar-first.component";
import { SecondComponentActionBar } from "./action-bar/action-bar-second.component";

import { AppComponent } from "./template/app.component";

import { FirstComponent } from "./components/first.component";
import { SecondComponent } from "./components/second.component";
import { NavigationTestRouter, NavigationSubRoutes } from "./router/router-outlet";

import { BindingComponent } from "./binding/binding-page";

import { ListViewComponent } from "./listView/commonTemplate/list-view-page";
import { ListViewControlComponent } from "./listView/customTemplate/list-view-item-template";
import { ListViewAsyncPipeComponent } from "./listView/asyncPipeTemplate/async-pipe-template";
import { ListViewMainPageComponent } from "./listView/listViewMainPage/list-view-main-page";
import { ListViewWithNestedTemplateComponent } from "./listView/nestedTemplate/list-view-nested-template";

import { ModalTest, ModalTestWithPushStrategy, ModalContent } from "./modal/modal-dialogs/modal-dialog.component";
import { ModalViewMainPageComponent } from "./modal/modal-view-main-page";

import { TabViewComponent } from "./tab-view/tab-view.component";

import { NavigationOptionsComponent } from "./navigation-options/navigation-options.component";
import { NavigationInfoComponent } from "./navigation-options/navigation-info.component";
import { MainComponent } from "./main/main-page-router-outlet";


export var routableComponents = [];

// Set isNavigatable: trueif the page is a mian page to other sub pages
export const routes = [
    routeEntry({ path: '', component: MainComponent, data: { title: "" } }),
    routeEntry({ path: '', component: ModalContent, data: { title: "" } }),
    routeEntry({ path: 'template', component: AppComponent, data: { title: "Template", isNavigatable: true} }),

    routeEntry({ path: 'router', component: NavigationTestRouter, children: NavigationSubRoutes, data: { title: "Router", isNavigatable: true} }),

    routeEntry({ path: 'first', component: FirstComponent, data: { title: "First", isNavigatable: true} }),
    routeEntry({ path: 'second', component: SecondComponent, data: { title: "Second", isNavigatable: true} }),

    routeEntry({ path: 'first-action-bar', component: FirstComponentActionBar, data: { title: "ActionBar1", isNavigatable: true} }),
    routeEntry({ path: 'second-action-bar', component: SecondComponentActionBar, data: { title: "ActionBar2", isNavigatable: true} }),

    routeEntry({ path: 'binding', component: BindingComponent, data: { title: "Binding", isNavigatable: true} }),

    routeEntry({ path: 'ListViewExamples', component: ListViewMainPageComponent, data: { title: "ListViewExamples", isNavigatable: true} }),
    routeEntry({ path: 'listView/commonTemplate', component: ListViewComponent, data: { title: "commonTemplate" } }),
    routeEntry({ path: 'listView/customTemplate', component: ListViewControlComponent, data: { title: "customTemplate" } }),
    routeEntry({ path: 'listView/asyncPipeTemplate', component: ListViewAsyncPipeComponent, data: { title: "asyncPipeTemplate" } }),
    routeEntry({ path: 'listView/nestedTemplate', component: ListViewWithNestedTemplateComponent, data: { title: "nestedTemplate" } }),

    routeEntry({ path: 'modal', component: ModalViewMainPageComponent, data: { title: "Modals", isNavigatable: true} }),
    routeEntry({ path: 'modal/modal-dialogs', component: ModalTest, data: { title: "modal" } }),
    routeEntry({ path: 'modal/modal-dialogs-push', component: ModalTestWithPushStrategy, data: { title: "modal(onPush)" } }),

    routeEntry({ path: 'tab-view', component: TabViewComponent, data: { title: "tab-view", isNavigatable: true } }),

    routeEntry({ path: 'nav-options', component: NavigationOptionsComponent, data: { title: "nav-options", isNavigatable: true} }),
    routeEntry({ path: 'nav-info', component: NavigationInfoComponent, data: { title: "nav-info" } }),
];

function routeEntry(data) {
    routableComponents.push(data.component)
    return data;
}
