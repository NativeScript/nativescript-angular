import { Component, Injectable } from "@angular/core";
import { CanActivate, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterExtensions, PageRoute } from "nativescript-angular/router";
import * as appSettings from "application-settings";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

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


export interface ResolvedData {
    id: number
}

@Component({
    selector: 'main',
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout>
      <Label text="Main Page" class="title"></Label>
      <Label [text]="'Hello, ' + loginService.username" class="subtitle"></Label>
      <Label [text]="'data.id: ' + (data$ | async).id" class="subtitle"></Label>
      <Button text="go deeper" nsRouterLink="/inner" class="stretch"></Button>
      <Button text='logout' (tap)="logout()" class="stretch"></Button>
    </StackLayout>
    `
})
class MainComponent {
    private data$: Observable<ResolvedData>;
    constructor(private nav: RouterExtensions, private loginService: LoginService, private pageRoute: PageRoute) {
        this.data$ = this.pageRoute.activatedRoute
            .switchMap(activatedRoute => activatedRoute.data)
            .map(data => data[0]);
    }

    logout() {
        this.loginService.logout().then((result) => {
            if (result) {
                this.nav.navigate(["/login"], { clearHistory: true });
            }
        });
    }

    onResolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("MainComponent.onResolve()")
        return true;
    }
}

@Component({
    selector: 'inner',
    styleUrls: ["examples/router/styles.css"],
    template: `
    <StackLayout>
      <Label text="Inner Page" class="title"></Label>
      <Button text='go back' (tap)="back()" class="stretch"></Button>
      <Button text='logout' (tap)="logout()" class="stretch"></Button>
    </StackLayout>
    `
})
class InnerComponent {
    constructor(private nav: RouterExtensions, private loginService: LoginService) {
    }

    back() {
        this.nav.backToPreviousPage();
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
            console.log("AuthGuard: authenticated");
            return true;
        }
        else {
            console.log("AuthGuard: redirecting to login");
            this.nav.navigate(["/login"]);
            return false;
        }
    }
}

@Injectable()
class ResolveGuard implements Resolve<ResolvedData> {
    static counter = 0;
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedData> | Promise<ResolvedData> | ResolvedData {
        const result: ResolvedData = { id: ResolveGuard.counter++ }
        console.log(`ResolveGuard: Fetching new data. Result: ${JSON.stringify(result)} `);
        return result;
    }
}

@Component({
    selector: 'navigation-test',
    template: `<page-router-outlet></page-router-outlet>`
})
export class LoginAppComponent {
    static routes = [
        { path: "", redirectTo: "/main", terminal: true, pathMatch: "full" },
        { path: "main", component: MainComponent, canActivate: [AuthGuard], resolve: [ResolveGuard] },
        { path: "inner", component: InnerComponent, canActivate: [AuthGuard] },
        { path: "login", component: LoginComponent },
    ];

    static entries = [
        LoginComponent,
        MainComponent,
        InnerComponent
    ];

    static providers = [
        AuthGuard,
        ResolveGuard,
        LoginService,
    ];
}
