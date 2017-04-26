// >> router-config-all
import { FirstComponent, SecondComponent } from "./navigation-common";

export const routes = [
    { path: "", redirectTo: "/first", pathMatch: "full" },
    { path: "first", component: FirstComponent },
    { path: "second", component: SecondComponent }
];
// << router-config-all
