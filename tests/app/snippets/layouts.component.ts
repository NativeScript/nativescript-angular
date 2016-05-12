import {Component} from "@angular/core";

@Component({
    selector: "gestures",
    templateUrl: "snippets/layouts.component.html",
    styles:[
        'Image { background-color: coral }',
        '.title { margin: 10; horizontal-align: center; font-size: 32 }',
        '#main > AbsoluteLayout { margin: 10 }',
        '#main > DockLayout { margin: 10 }',
        '#main > GridLayout { margin: 10 }',
        '#main > StackLayout { margin: 10 }',
        '#main > WrapLayout { margin: 10 }'
    ]
})
export class LayoutsComponent {
}
