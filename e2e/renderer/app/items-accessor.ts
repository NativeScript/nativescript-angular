import { ItemsService } from "./items.service";

export class ItemsAccessor {
    public items: number[];

    constructor(public itemsService: ItemsService) {
        this.items = itemsService.getAll();
    }

    add() {
        this.items = this.itemsService.add(this.items);
    }

    remove(item?: number) {
        item = item || this.items[this.items.length - 1];
        this.items = this.itemsService.remove(this.items, item);
    }

}
