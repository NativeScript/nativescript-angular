import {Component} from "@angular/core";

@Component({
    selector: "binding",
    templateUrl: 'binding/binding-page.html'
})

export class BindingComponent {
    private _oneWayDataBinding: string;
    private _twoWayDataBinding: string;
    private _curlyBracket: string;
    private _result: string;

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
        this._oneWayDataBinding = "one-way";
        this._twoWayDataBinding = "two-way";
        this._curlyBracket = "curly-bracket";
        this._result = ""
    }
}