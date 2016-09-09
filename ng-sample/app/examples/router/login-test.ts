import { Component, OnInit, OnDestroy, Injectable } from "@angular/core";
import { Router, CanActivate} from '@angular/router';
import { Observable } from "rxjs";
import { RouterExtensions } from "nativescript-angular/router";
import { NSLocationStrategy } from "nativescript-angular/router/ns-location-strategy";
import { BehaviorSubject} from "rxjs";
import * as appSettings from "application-settings"

const USER_KEY = "user";

@Injectable()
class LoginService {
    username: string;
    get isLogged(): boolean { return !!this.username; }

    constructor() {
        this.username = appSettings.getString(USER_KEY);
        console.log("LoginService.constructor() username: " + this.username);
    }

    login(user: string, password: string): Promise<boolean> {
        console.log("LoginService.login() username: " + this.username);
        if (user) {
            this.username = user;
            appSettings.setString(USER_KEY, this.username);
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    logout(): Promise<boolean> {
        console.log("LoginService.logout()");

        this.username = undefined;
        appSettings.remove(USER_KEY);
        return Promise.resolve(true);
    }
}


@Component({
    selector: 'login',
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout>
      <Label text="Login Page" class="title"></Label>
    
      <TextField [(ngModel)]="user" hint="user"></TextField>
      <TextField [(ngModel)]="pass" hint="password" secure="true"></TextField>
      <Button text='Login' (tap)="login()" class="stretch"></Button>
    </StackLayout>
    `
})
class LoginComponent {
    public user: string;
    public pass: string;
    constructor(private nav: RouterExtensions, private loginService: LoginService) {
    }

    login() {
        this.loginService.login(this.user, this.pass).then((result) => {
            if (result) {
                this.nav.navigate(["/"], { clearHistory: true });
            }
        });
    }
}

@Component({
    selector: 'main',
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout>
      <Label text="Main Page" class="title"></Label>
      <Label [text]="'Hello, ' + loginService.username" class="subtitle"></Label>
      <Button text='logout' (tap)="logout()" class="stretch"></Button>
    </StackLayout>
    `
})
class MainComponent {
    constructor(private nav: RouterExtensions, private loginService: LoginService) {
    }

    logout() {
        this.loginService.logout().then((result) => {
            if (result) {
                this.nav.navigate(["/login"], { clearHistory: true });
            }
        });
    }
}

@Injectable()
class AuthGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private nav: RouterExtensions) {
    }

    canActivate() {
        if (this.loginService.isLogged) {
            console.log("GUARD: authenticated");
            return true;
        }
        else {
            console.log("GUARD: redirecting to login");
            this.nav.navigate(["/login"]);
            return false;
        }
    }
}

@Component({
    selector: 'navigation-test',
    template: `<page-router-outlet></page-router-outlet>`
})
export class LoginAppComponent {
    static routes = [
        { path: "", redirectTo: "/main", terminal: true, pathMatch: "full" },
        { path: "main", component: MainComponent, canActivate: [AuthGuard] },
        { path: "login", component: LoginComponent },
    ]

    static entries = [
        MainComponent,
        LoginComponent
    ]

    static providers = [
        AuthGuard,
        LoginService,
    ]
}
