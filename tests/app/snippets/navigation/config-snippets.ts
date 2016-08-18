import { NgModule } from "@angular/core";
// Just fake routes for config snippets
class LoginComponent { }
class GroceryListComponent { }
class GroceryComponent { }
class GroceriesApp { }

// >> router-config
const routes = [
    { path: "login", component: LoginComponent },
    { path: "groceries", component: GroceryListComponent },
    { path: "grocery/:id", component: GroceryComponent },
];
// << router-config

// >> router-provider
import { NativeScriptRouterModule } from "nativescript-angular/router";

@NgModule({
    bootstrap: [GroceriesApp],
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ]
})
export class GroceriesAppModule {}
// << router-provider

// >> router-bootstrap
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
// >> (hide)
function start_snippet() {  
// << (hide)
platformNativeScriptDynamic().bootstrapModule(GroceriesAppModule);
// << router-bootstrap
}
