// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { View } from "tns-core-modules/ui/core/view";
import { Slider } from "tns-core-modules/ui/slider";
import { Switch } from "tns-core-modules/ui/switch";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { TimePicker } from "tns-core-modules/ui/time-picker";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { TextField } from "tns-core-modules/ui/text-field";
import {
    NumberValueAccessor,
    CheckedValueAccessor,
    DateValueAccessor,
    TimeValueAccessor,
    SelectedIndexValueAccessor,
    TextValueAccessor
} from "nativescript-angular/forms/value-accessors";
import { ElementRef } from "@angular/core";

class TestElementRef implements ElementRef {
    constructor(public nativeElement: View) { };
}

class TestNumberValueAccessor extends NumberValueAccessor {
    constructor() {
        super(new TestElementRef(new Slider()));
    }
}

class TestCheckedValueAccessor extends CheckedValueAccessor {
    constructor() {
        super(new TestElementRef(new Switch()));
    }
}

class TestDateValueAccessor extends DateValueAccessor {
    constructor() {
        super(new TestElementRef(new DatePicker()));
    }
}

class TestSelectedIndexValueAccessor extends SelectedIndexValueAccessor {
    constructor() {
        super(new TestElementRef(TestSelectedIndexValueAccessor.picker()));
    }

    static picker(): ListPicker {
        const picker = new ListPicker();
        picker.items = [
            "1",
            "2",
            "3",
            "4",
            "5",
        ];
        return picker;
    }
}

class TestTimeValueAccessor extends TimeValueAccessor {
    constructor() {
        super(new TestElementRef(new TimePicker()));
    }
}

class TestTextValueAccessor extends TextValueAccessor {
    constructor() {
        super(new TestElementRef(new TextField()));
    }
}

describe("two-way binding via ng-model", () => {
    it("converts strings to numbers", () => {
        const accessor = new TestNumberValueAccessor();
        const defaultValue = accessor.view.value;

        accessor.writeValue(null);
        assert.strictEqual(defaultValue, accessor.view.value, "setting null should keep the default value");

        accessor.writeValue("42");
        assert.strictEqual(42, accessor.view.value);

        accessor.writeValue("blah");
        assert.notEqual(accessor.view.value, accessor.view.value, "defaults to NaN on parse errors");
        
        accessor.writeValue(null);
        assert.strictEqual(defaultValue, accessor.view.value, "setting null should reset the value");
    });

    it("converts strings to bools", () => {
        const accessor = new TestCheckedValueAccessor();
        const defaultValue = accessor.view.checked;

        accessor.writeValue(null);
        assert.strictEqual(false, accessor.view.checked, "setting null should keep the default value");

        accessor.writeValue("true");
        assert.strictEqual(true, accessor.view.checked);

        accessor.writeValue(null);
        assert.strictEqual(defaultValue, accessor.view.checked, "setting null should reset the value");

        assert.throws(() => accessor.writeValue("blah"));
    });

    it("converts strings to dates", () => {
        const accessor = new TestDateValueAccessor();
        const defaultDate = accessor.view.date; // current date time
        
        assert.instanceOf(accessor.view.date, Date);
        let diff = Math.abs(accessor.view.date.getTime() - defaultDate.getTime());
        assert.isTrue(diff < 1000, "setting null should reset the value");

        accessor.writeValue("2010-03-17");
        assert.equal(formatDate(new Date(2010, 2, 17)), formatDate(accessor.view.date));
        
        accessor.writeValue(null);
        assert.instanceOf(accessor.view.date, Date);
        diff = Math.abs(accessor.view.date.getTime() - defaultDate.getTime());
        assert.isTrue(diff < 1000, "setting null should reset the value");
    });

    it("converts strings to int selection", () => {
        const accessor = new TestSelectedIndexValueAccessor();
        const defaultValue = accessor.view.selectedIndex;
        
        accessor.writeValue(null);
        accessor.ngAfterViewInit();
        assert.strictEqual(defaultValue, accessor.view.selectedIndex, "setting null should keep the default value");

        accessor.writeValue("3");
        accessor.ngAfterViewInit();
        assert.strictEqual(3, accessor.view.selectedIndex);

        accessor.writeValue(null);
        assert.strictEqual(defaultValue, accessor.view.selectedIndex, "setting null should reset the value");

        accessor.writeValue("blah");
        accessor.ngAfterViewInit();
        assert.notEqual(accessor.view.selectedIndex, accessor.view.selectedIndex,
            "default to NaN on parse errors");
    });

    it("converts strings to times", () => {
        const accessor = new TestTimeValueAccessor();

        assert.throws(() => accessor.writeValue("2010/03/17 12:54"));
        assert.throws(() => accessor.writeValue("three hours from now"));
    });

    it("converts values to text", () => {
        const accessor = new TestTextValueAccessor();
        const defaultValue = accessor.view.text;

        accessor.writeValue(null);
        assert.equal(defaultValue, accessor.view.text, "setting null should keep the default value");

        accessor.writeValue("blah");
        assert.equal("blah", accessor.view.text);

        accessor.writeValue(null);
        assert.equal(defaultValue, accessor.view.text, "setting null should reset the value");

        accessor.writeValue({ toString: () => "stringified" });
        assert.equal("stringified", accessor.view.text);
    });
});

function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}`;
}
