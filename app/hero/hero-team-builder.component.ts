import { Component } from "@angular/core";

import { Heroes } from "./hero.service";

@Component({
    moduleId: module.id,
    selector: "hero-team-builder",
    templateUrl: "./hero-team-builder.component.html",
    providers: [Heroes]
})
export class HeroTeamBuilderComponent {
    constructor(public heroes: Heroes) { }
}
