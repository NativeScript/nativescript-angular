import { Observable as RxObservable } from "rxjs/Observable";
import {
    Component,
    Input,
    ChangeDetectionStrategy
} from "@angular/core";

@Component({
    styles: [ ".odd { background-color : yellow } " +
            ".even{ background-color : green } " +
            ".test{ font-family:FontAwesome; font-size:70 }"],
    template: `
    <StackLayout>
        <Button style="text-align:center;" textWrap="true">
            <FormattedString >
                <Span text="&#xf1ec;"  class="test" >
                </Span>
                <Span text="\nLabel 1">
                </Span>
                <Span [text]="test">
                </Span>
           </FormattedString>
        </Button>
        <Button style="text-align:left;" textWrap="true" >
            <FormattedString >
                <Span [text]="'&#xf1b9;'" class="test" fontSize="14" style="color:red">
                </Span>
                <Span text="\nLabel 2">
                </Span>
                <Span [text]="test">
                </Span>
           </FormattedString>
        </Button>
        <Button style="text-align:right; color:green" textWrap="true" class="test" fontSize="14" >
            <FormattedString >
                <Span [text]="'&#xf1b9;'" >
                </Span>
                <Span text="\nLabel 3">
                </Span>
                <Span [text]="test">
                </Span>
           </FormattedString>
        </Button>
    </StackLayout>
    `
})
export class ButtonTextAlignmentComponent {

    public get test(): string {
        return "\ntest";
    }
}
