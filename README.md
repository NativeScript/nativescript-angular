# NativeScript Angular
[![Build Status](https://travis-ci.org/NativeScript/nativescript-angular.svg?branch=master)](https://travis-ci.org/NativeScript/nativescript-angular)

This repository contains the code for integration of NativeScript with Angular. 

[NativeScript](https://www.nativescript.org/) is a framework which enables developers to write truly native mobile applications for Android and iOS using JavaScript and CSS. [Angular](https://angular.io/) is one of the most popular open source JavaScript frameworks for application development. We [worked closely with developers at Google](http://angularjs.blogspot.bg/2015/12/building-mobile-apps-with-angular-2-and.html) to make Angular in NativeScript a reality. The result is a software architecture that allows you to build mobile apps using the same framework—and in some cases the same code—that you use to build Angular web apps, with the performance you’d expect from native code. [Read more about building truly native mobile apps with NativeScript and Angular](https://docs.nativescript.org/tutorial/ng-chapter-0).


<!-- TOC depthFrom:2 -->

- [NativeScript Angular](#nativescript-angular)
  - [Watch the video explaining Angular and NativeScript](#watch-the-video-explaining-angular-and-nativescript)
  - [Explore the examples](#explore-the-examples)
  - [Contribute](#contribute)
  - [Known issues](#known-issues)
  - [Get Help](#get-help)

<!-- /TOC -->


## Watch the video explaining Angular and NativeScript
[NativeScript session on AngularConnect conference](https://www.youtube.com/watch?v=4SbiiyRSIwo)

## Explore the examples

The `e2e` apps are meant for testing stuff. You can take a look at these additional sample apps that use the published builds from npm:

* [Hello world starter](https://github.com/NativeScript/nativescript-app-templates/tree/master/packages/template-hello-world-ng)
* [Master-detail template](https://github.com/NativeScript/nativescript-app-templates/tree/master/packages/template-master-detail-ng)
* [Drawer navigation template](https://github.com/NativeScript/nativescript-app-templates/tree/master/packages/template-drawer-navigation-ng)
* [TabView navigation template](https://github.com/NativeScript/nativescript-app-templates/tree/master/packages/template-tab-navigation-ng)
* [NativeScript Angular SDK examples](https://github.com/NativeScript/nativescript-sdk-examples-ng)

## Contribute
We love PRs! Check out the [contributing guidelines](CONTRIBUTING.md) and [development workflow for local setup](DevelopmentWorkflow.md). If you want to contribute, but you are not sure where to start - look for [issues labeled `help wanted`](https://github.com/NativeScript/nativescript-angular/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

## Known issues

1. There are certain issues with the Parse5DomAdapter and we'll likely need to provide our own later on:
  * Self-closing elements (`<Label text="Name" /><Button text="Save" />`) get parsed wrong (in this case Button gets parsed as a Label child.
  
## Get Help 
Please, use [github issues](https://github.com/NativeScript/nativescript-angular/issues) strictly for [reporting bugs](CONTRIBUTING.md#reporting-bugs) or [requesting features](CONTRIBUTING.md#requesting-new-features). For general questions and support, check out [Stack Overflow](https://stackoverflow.com/questions/tagged/nativescript) or ask our experts in [NativeScript community Slack channel](http://developer.telerik.com/wp-login.php?action=slack-invitation).
  
![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/nativescript-angular?pixel) 
