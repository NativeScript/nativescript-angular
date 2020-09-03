import { Component} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Page } from "@nativescript/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: "detail",
    template: `
    <StackLayout>
        <Label text="NestedDetail" class="nested-header"></Label>
            
        <Label [text]="'nested-param: ' + (id$ | async)"></Label>
    </StackLayout>
    `
})
export class DetailComponent {
    public id$: Observable<string>;

    constructor(private route: ActivatedRoute, private page: Page) {
        page.actionBarHidden = true;
        console.log("DetailComponent - constructor()");
        this.id$ = route.params.pipe(map(r => r["id"]));
    }

    ngOnInit() {
        console.log("DetailComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("DetailComponent - ngOnDestroy()");
    }
}
