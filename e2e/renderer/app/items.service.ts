import { Injectable } from '@angular/core';

@Injectable()
export class ItemsService {
    private items = [ 0 ];

    getAll() {
        return [...this.items];
    }

    add(items) {
        return [
            ...items,
            items.length,
        ];
    }

    remove(items, item?: number) {
        const index = item ? items.indexOf(item) : items.length - 1;

        return this.removeAt(items, index);
    }

    private removeAt(items: any[], index: number) {
        items = [
            ...items.slice(0, index),
            ...items.slice(index + 1),
        ];

        console.log(`Removed ${index}th element`);

        return items;
    }
}
