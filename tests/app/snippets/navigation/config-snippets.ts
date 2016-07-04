// Just fake routes for config snippets
class LoginComponent { }
class GroceryListComponent { }
class GroceryComponent { }
class GroceriesApp { }

// >> router-config
import {RouterConfig} from '@angular/router';
const routes: RouterConfig = [
    { path: "login", component: LoginComponent },
    { path: "groceries", component: GroceryListComponent },
    { path: "grocery/:id", component: GroceryComponent },
];
// << router-config

// >> router-provider
import {nsProvideRouter} from 'nativescript-angular/router';
export const APP_ROUTER_PROVIDERS = [
    nsProvideRouter(routes, { enableTracing: false })
];
// << router-provider

// >> router-bootstrap
import {nativeScriptBootstrap} from 'nativescript-angular/application';
// >> (hide)
function start_snippet() {  
// << (hide)
nativeScriptBootstrap(GroceriesApp, [APP_ROUTER_PROVIDERS]);
// << router-bootstrap
}
