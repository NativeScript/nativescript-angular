import { OnInit } from "@angular/core";
import { Item } from "./item";
import { ItemService } from "./item.service";
export declare class ItemsComponent implements OnInit {
    private itemService;
    items: Item[];
    constructor(itemService: ItemService);
    ngOnInit(): void;
}
