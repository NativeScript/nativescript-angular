import { Component } from "@angular/core";

import { FirstComponentActionBar } from "./action-bar/action-bar-first.component";
import { SecondComponentActionBar } from "./action-bar/action-bar-second.component";

import { AppComponent } from "./template/app.component";

import { FirstComponent } from "./router/router-outlet/first.component";
import { SecondComponent } from "./router/router-outlet/second.component";
import { NavigationComponent, NavigationSubRoutes } from "./router/router-outlet/navigation.component";
import { LazyNavigationComponent } from "./router/lazy-module-navigation/lazy-navigation.component";

import { BindingComponent } from "./binding/binding-page";

import { ListViewComponent } from "./list-view/list-view-page";
import { ListViewControlComponent } from "./list-view/list-view-item-template";
import { ListViewAsyncPipeComponent } from "./list-view/async-pipe-template";
import { ListViewMainPageComponent } from "./list-view/list-view-main-page";
import { ListViewWithNestedTemplateComponent } from "./list-view/list-view-nested-template";

import { ListPickerMainPageComponent } from "./list-picker/list-picker-main-page";
import { ListPickerComponent } from "./list-picker/list-picker";

import { ModalTest, ModalTestWithPushStrategy, ModalContent } from "./modal/modal-dialogs/modal-dialog.component";
import { ModalViewMainPageComponent } from "./modal/modal-view-main-page";
import { LazyLoadModalComponent } from "./modal/lazy/lazy-load-modal.component";

import { TabViewComponent } from "./tab-view/tab-view.component";

import { NavigationOptionsComponent } from "./navigation-options/navigation-options.component";
import { NavigationInfoComponent } from "./navigation-options/navigation-info.component";

import { SegmentedBarMainPageComponent } from "./segmented-bar/segmented-bar-main-page.component";
import { SegmentedBarIssue649Component } from "./segmented-bar/issue-649.component";

import { DatePickerMainPageComponent } from "./date-picker/date-picker-main-page.component";
import { DatePickerIssue324Component } from "./date-picker/issue-324.component";

import { MainComponent } from "./main/main-page-router-outlet";

export const routableComponents = [
    MainComponent,
    ModalContent,
    AppComponent,

    NavigationComponent,
    LazyNavigationComponent,

    FirstComponent,
    SecondComponent,

    FirstComponentActionBar,
    SecondComponentActionBar,

    BindingComponent,

    ListViewMainPageComponent,
    ListViewComponent,
    ListViewControlComponent,
    ListViewAsyncPipeComponent,
    ListViewWithNestedTemplateComponent,

    ListPickerComponent,
    ListPickerMainPageComponent,

    ModalViewMainPageComponent,
    ModalTest,
    ModalTestWithPushStrategy,
    LazyLoadModalComponent,

    TabViewComponent,

    NavigationOptionsComponent,
    NavigationInfoComponent,
    SegmentedBarMainPageComponent,
    SegmentedBarIssue649Component,
    DatePickerMainPageComponent,
    DatePickerIssue324Component,
];

// Set isNavigatable: true if the page is a mian page to other sub pages
export const routes = [
    { path: '', component: MainComponent, data: { title: "" } },
    { path: '', component: ModalContent, data: { title: "" } },
    { path: 'template', component: AppComponent, data: { title: "Template", isNavigatable: true } },

    { path: 'router', component: NavigationComponent, children: NavigationSubRoutes, data: { title: "Router", isNavigatable: true } },
    { path: 'lazy-router', component: LazyNavigationComponent, data: { title: "Lazy Router", isNavigatable: true } },

    { path: 'first', component: FirstComponent, data: { title: "First", isNavigatable: true } },
    { path: 'second', component: SecondComponent, data: { title: "Second", isNavigatable: true } },

    { path: 'first-action-bar', component: FirstComponentActionBar, data: { title: "ActionBar1", isNavigatable: true } },
    { path: 'second-action-bar', component: SecondComponentActionBar, data: { title: "ActionBar2", isNavigatable: true } },

    { path: 'binding', component: BindingComponent, data: { title: "Binding", isNavigatable: true } },

    { path: 'ListViewExamples', component: ListViewMainPageComponent, data: { title: "ListViewExamples", isNavigatable: true } },
    { path: "ListViewExamples/commonTemplate", component: ListViewComponent, data: { title: "commonTemplate" } },
    { path: "ListViewExamples/customTemplate", component: ListViewControlComponent, data: { title: "customTemplate" } },
    { path: "listView/asyncPipeTemplate", component: ListViewAsyncPipeComponent, data: { title: "asyncPipeTemplate" } },
    { path: "listView/nestedTemplate", component: ListViewWithNestedTemplateComponent, data: { title: "nestedTemplate" } },

    { path: 'listPicker', component: ListPickerMainPageComponent, data: { title: "ListPicker", isNavigatable: true } },
    { path: 'listPicker/list-picker', component: ListPickerComponent, data: { title: "ListPicker", isNavigatable: false } },

    { path: 'modal', component: ModalViewMainPageComponent, data: { title: "Modals", isNavigatable: true } },
    { path: 'modal/modal-dialogs', component: ModalTest, data: { title: "modal" } },
    { path: 'modal/modal-dialogs-push', component: ModalTestWithPushStrategy, data: { title: "modal(onPush)" } },
    { path: 'modal/lazy', component: LazyLoadModalComponent, data: { title: "modal(lazy)" } },

    { path: 'tab-view', component: TabViewComponent, data: { title: "tab-view", isNavigatable: true } },

    { path: 'nav-options', component: NavigationOptionsComponent, data: { title: "nav-options", isNavigatable: true } },
    { path: 'nav-info', component: NavigationInfoComponent, data: { title: "nav-info" } },

    { path: 'segmented-bar', component: SegmentedBarMainPageComponent, data: { title: "SegmentedBar", isNavigatable: true } },
    { path: 'segmented-bar/issue-649', component: SegmentedBarIssue649Component, data: { title: "issue-649" } },

    { path: 'date-picker', component: DatePickerMainPageComponent, data: { title: "DatePicker", isNavigatable: true } },
    { path: 'date-picker/issue-324', component: DatePickerIssue324Component, data: { title: "issue-324" } },

    // Needed for AoT compilation
    {
        path: "lazy",
        loadChildren: "./lazy/lazy.module#LazyModule"
    },
];

