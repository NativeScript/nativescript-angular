import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { DataService, DataItem } from "../data.service";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "ns-team-details",
    moduleId: module.id,
    templateUrl: "./team-detail.component.html",
})
export class TeamDetailComponent implements OnInit {
    item: DataItem;
    subscription: Subscription;    

    constructor(
        private data: DataService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.params.subscribe(params => {
            const id = +params["id"];
            this.item = this.data.getTeam(id);
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
