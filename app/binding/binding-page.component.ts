import { Component } from "@angular/core";

@Component({
    selector: "binding",
    template: `
    <StackLayout>
        <TextField hint="oneWayDataBinding" keyboardType="email" [text]="oneWayDataBinding" autocorrect="false" autocapitalizationType="none"></TextField>
        <TextField hint="twoWayDataBindingBanana" keyboardType="email" [(ngModel)]="twoWayDataBinding" autocorrect="false" autocapitalizationType="none"></TextField>
        <TextField hint="" keyboardType="email" text="{{ curlyBracket }}" autocorrect="false" autocapitalizationType="none"></TextField>
        <Label text='Label with curlyBaracket binding: {{ twoWayDataBinding }}'></Label>
        <Label [text]='completedDate | date:"fullDate"' ></Label>
        <StackLayout orientation="horizontal" automationText="getValues">
            <Button (tap)="changeValues()" text="update from code" ></Button>
            <Button (tap)="getValues()" text="get" width="80" height="40"></Button>
        </StackLayout>
        <TextView [text]="results" textWrap="true"></TextView>
    </StackLayout>
    `
})

export class BindingComponent {
    private _oneWayDataBinding: string;
    private _twoWayDataBinding: string;
    private _curlyBracket: string;
    private _result: string;
    public completedDate: Date = new Date(2016,5,3);

    constructor() {
        this.refresh();
    }

    get oneWayDataBinding() {
        return this._oneWayDataBinding;
    }

    get twoWayDataBinding() {
        return this._twoWayDataBinding;
    }

    set twoWayDataBinding(value: string) {
        this._twoWayDataBinding = value;
    }

    get curlyBracket() {
        return this._curlyBracket;
    }

    set curlyBracket(value: string) {
        this._curlyBracket = value;
    }

    get results() {
        return this._result;
    }

    changeValues() {
        this._oneWayDataBinding = this.twoWayDataBinding;
        this._curlyBracket = this.twoWayDataBinding;
        this._twoWayDataBinding = this.twoWayDataBinding;
    }

    getValues() {
        this._result = "";
        this._result += "one-way value is " + this.oneWayDataBinding + "; \n";
        this._result += "two-way value is " + this.twoWayDataBinding + "; \n";
        this._result += "curly-bracket value is " + this.curlyBracket + "; \n";
    }

    private refresh() {
        this._oneWayDataBinding = "1";
        this._twoWayDataBinding = "2";
        this._curlyBracket = "5";
        this._result = ""
    }
}