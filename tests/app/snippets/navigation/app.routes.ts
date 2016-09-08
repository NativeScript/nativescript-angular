import {FirstComponent, SecondComponent} from "./navigation-common";
// >> router-config-all
export const routes = [
    { path: "", redirectTo: "/first", pathMatch: "full", terminal: true },
    { path: "first", component: FirstComponent },
    { path: "second", component: SecondComponent },
];
// << router-config-all
