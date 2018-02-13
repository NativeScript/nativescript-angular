import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { DataService, DataItem } from "../data.service";

@Component({
    selector: "ns-player-details",
    moduleId: module.id,
    templateUrl: "./player-detail.component.html",
})
export class PlayerDetailComponent implements OnInit {
    item: DataItem;

    constructor(
        private data: DataService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params["id"];
        this.item = this.data.getPlayer(id);
    }
}
