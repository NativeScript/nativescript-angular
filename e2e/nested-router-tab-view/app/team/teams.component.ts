import { Component, OnInit } from "@angular/core";
import { DataService, DataItem } from "../data.service";

@Component({
    selector: "ns-teams",
    moduleId: module.id,
    templateUrl: "./teams.component.html",
})
export class TeamsComponent implements OnInit {
    items: DataItem[];

    constructor(private itemService: DataService) { }

    ngOnInit(): void {
        this.items = this.itemService.getTeams();
    }
}