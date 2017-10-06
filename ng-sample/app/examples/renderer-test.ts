import { Component, Directive, Host, ElementRef, Input } from "@angular/core";
import { Observable } from "data/observable";
import { SegmentedBarItem } from "ui/segmented-bar";


function createTabItem(title: string) {
    let item = new SegmentedBarItem();
    item.title = title;
    return item;
}

@Component({
    moduleId: module.id,
    selector: "templated-component",
    templateUrl: "../title.html"
})
export class TemplatedComponent {
    @Input() public renderChild: boolean = false;
    @Input() public text: string = "Hello, external templates";
}

@Directive({
    selector: "Progress",
})
export class ProgressDirective {
    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        this.element.nativeElement.value = 90;
    }
}

@Component({
    moduleId: module.id,
    selector: "renderer-test",
    templateUrl: "./renderer-test.html"
})
export class RendererTest {
    public buttonText: string = "";
    public showDetails: boolean = false;
    public detailsText: string = "";
    public moreDetailsText: string = "";
    public detailLines: Array<string> = [];
    public isValid: boolean = true;
    public model: any;

    public testModel = { mydate: new Date() };

    static entries = [
        TemplatedComponent,
    ];

    static exports = [
        ProgressDirective
    ];

    constructor() {
        this.buttonText = "Save...";
        this.showDetails = true;
        this.detailsText = "plain ng-if directive \ndetail 1-2-3...";
        this.moreDetailsText = "More details:";
        this.model = {
            "test": "Jack",
            "testBoolean": false,
            "deliveryDate": new Date(),
            "deliveryTime": new Date(),
            "mydate": new Date(),
            "sliderTest": 0,
            "search": null,
            "selectedIndex": 0,
            "listPickerItems": [
                1, 2, 3, 4
            ],
            "segmentedBarItems": [
                createTabItem("first"),
                createTabItem("second"),
                createTabItem("third"),
                createTabItem("fourth")
            ]
        };

        this.detailLines = [
            "ngFor inside a ngIf 1",
            "ngFor inside a ngIf 2",
        ];
    }

    onSave($event, name, $el) {
        console.log("onSave event " + $event + " name " + name);
        alert(name);
    }

    testLoaded($event) {
        console.log("testLoaded called with event args: " + $event);
    }

    onToggleDetails() {
        console.log("onToggleDetails current: " + this.showDetails);
        this.showDetails = !this.showDetails;
    }

    setUpperCase($event) {
        if ($event.value && $event.value.toUpperCase) {
            return $event.value.toUpperCase();
        }
        if (typeof $event === "string") {
            return $event.toUpperCase();
        }
        return $event;
    }
}
