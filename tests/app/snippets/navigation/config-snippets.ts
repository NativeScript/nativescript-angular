import { NgModule } from "@angular/core";
// Just fake routes for config snippets
class LoginComponent { }
class GroceryListComponent { }
class GroceryComponent { }
class GroceriesApp { }

// >> router-config
export const routes = [
    { path: "login", component: LoginComponent },
    { path: "groceries", component: GroceryListComponent },
    { path: "grocery/:id", component: GroceryComponent }
];
// << router-config

// >> router-provider and bootstrap
import { NativeScriptRouterModule, platformNativeScriptDynamic } from "nativescript-angular";

@NgModule({
    bootstrap: [GroceriesApp],
    imports: [
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ]
})
export class GroceriesAppModule {}
// << router-provider

// >> (hide)
function start_snippet() {
// << (hide)
platformNativeScriptDynamic().bootstrapModule(GroceriesAppModule);
// << router-bootstrap
}
