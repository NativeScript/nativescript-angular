import { OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Item } from "./item";
import { ItemService } from "./item.service";
export declare class ItemDetailComponent implements OnInit {
    private itemService;
    private route;
    item: Item;
    constructor(itemService: ItemService, route: ActivatedRoute);
    ngOnInit(): void;
}
