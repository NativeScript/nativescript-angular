# NativeScript Angular
[![Build Status](https://travis-ci.org/NativeScript/nativescript-angular.svg?branch=master)](https://travis-ci.org/NativeScript/nativescript-angular)

This repository contains the code for integration of NativeScript with Angular. 

[NativeScript](https://www.nativescript.org/) is a framework which enables developers to write truly native mobile applications for Android and iOS using JavaScript and CSS. [Angular](https://angular.io/) is one of the most popular open source JavaScript frameworks for application development. We [worked closely with developers at Google](http://angularjs.blogspot.bg/2015/12/building-mobile-apps-with-angular-2-and.html) to make Angular in NativeScript a reality. The result is a software architecture that allows you to build mobile apps using the same framework—and in some cases the same code—that you use to build Angular web apps, with the performance you’d expect from native code. [Read more about building truly native mobile apps with NativeScript and Angular](https://docs.nativescript.org/tutorial/ng-chapter-0).


<!-- TOC depthFrom:2 -->

- [Watch the video explaining Angular and NativeScript](#watch-the-video-explaining-angular-and-nativescript)
- [Explore the examples](#explore-the-examples)
- [Contribute](#contribute)
- [Known issues](#known-issues)
- [Get Help](#get-help)

<!-- /TOC -->


## Watch the video explaining Angular and NativeScript
[NativeScript session on AngularConnect conference](https://www.youtube.com/watch?v=4SbiiyRSIwo)

## Explore the examples

The `ng-sample` app is meant for testing stuff while developing the renderer code, and isn't the best example out there. You can take a look at these sample apps that use the published builds from npm:

* [Hello world starter](https://github.com/NativeScript/template-hello-world-ng)
* [TodoMVC sample implementation](https://github.com/NativeScript/sample-ng-todomvc)

## Contribute
We love PRs! Check out the [contributing guidelines](CONTRIBUTING.md) and [development workflow for local setup](DevelopmentWorkflow.md). If you want to contribute, but you are not sure where to start - look for [issues labeled `help wanted`](https://github.com/NativeScript/nativescript-angular/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

## Known issues

1. There are certain issues with the Parse5DomAdapter and we'll likely need to provide our own later on:
  * Self-closing elements (`<Label text="Name" /><Button text="Save" />`) get parsed wrong (in this case Button gets parsed as a Label child.
  
## Get Help 
Please, use [github issues](https://github.com/NativeScript/nativescript-angular/issues) strictly for [reporting bugs](CONTRIBUTING.md#reporting-bugs) or [requesting features](CONTRIBUTING.md#requesting-new-features). For general questions and support, check out the [NativeScript community forum](https://discourse.nativescript.org/) or ask our experts in [NativeScript community Slack channel](http://developer.telerik.com/wp-login.php?action=slack-invitation).
  
![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/nativescript-angular?pixel) 
