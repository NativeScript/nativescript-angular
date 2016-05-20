import {Component} from '@angular/core';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, ComponentInstruction, Router, RouteParams, RouteData} from '@angular/router-deprecated';
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "../../nativescript-angular/router/ns-router";
import {isBlank} from '@angular/core/src/facade/lang';

@Component({
    selector: 'login-page',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <StackLayout orientation='horizontal'>
            <Label text="user: "></Label>
            <TextField text="user"></TextField>
        </StackLayout>
        <StackLayout orientation='horizontal'>
            <Label text="pass: "></Label>
            <TextField text="pass"></TextField>
        </StackLayout>
        <Button text='Login' (tap)="onLoginTap()"></Button>
    </StackLayout>
    `
})
export class LoginPage {
    private router: Router;
    constructor(private _router: Router){
        this.router = _router;
    }
    onLoginTap(args) {
        this.router.navigate(["Main", { "success" : true }]);
    }
}

@Component({
    selector: 'main',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <TextField text="Main Content"></TextField>
    `
})
export class MainComponent {
    private getParamOrData(key: string, params: RouteParams, data: RouteData) {
        let result = params.get(key);
        if (!isBlank(result)) {
            return result;
        } else {
            return data.get(key);
        }
    }
    
    constructor(params: RouteParams, private _router: Router, private _data: RouteData) {
        let success = this.getParamOrData("success", params, _data);
        if (!success) {
            _router.navigate(["Login"]);
        }
        console.log("params: " + params);
    }
}

@Component({
    selector: 'login-test',
    directives: [NS_ROUTER_DIRECTIVES],
    template: `<page-router-outlet></page-router-outlet>`
})
@RouteConfig([
    { path: '/login', component: LoginPage, name: 'Login' },
    { path: '/main', component: MainComponent, name: 'Main', data: {"success": false}, useAsDefault: true },
])
export class LoginTest {
    
}