//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {View} from "ui/core/view";
import {Slider} from "ui/slider";
import {Switch} from "ui/switch";
import {DatePicker} from "ui/date-picker";
import {TimePicker} from "ui/time-picker";
import {ListPicker} from "ui/list-picker";
import {TextField} from "ui/text-field";
import {NumberValueAccessor} from "nativescript-angular/value-accessors/number-value-accessor";
import {CheckedValueAccessor} from "nativescript-angular/value-accessors/checked-value-accessor";
import {DateValueAccessor} from "nativescript-angular/value-accessors/date-value-accessor";
import {TimeValueAccessor} from "nativescript-angular/value-accessors/time-value-accessor";
import {SelectedIndexValueAccessor} from "nativescript-angular/value-accessors/selectedIndex-value-accessor";
import {TextValueAccessor} from "nativescript-angular/value-accessors/text-value-accessor";
import {ElementRef} from 'angular2/core';

class TestElementRef implements ElementRef {
    constructor(public nativeElement: View) {};
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
        super(new TestElementRef(new ListPicker()));
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
        const accessor = new TestNumberValueAccessor()

        accessor.writeValue(null);
        assert.strictEqual(0, accessor.view.value, "default to 0 on empty")

        accessor.writeValue("42");
        assert.strictEqual(42, accessor.view.value)

        accessor.writeValue("blah");
        assert.strictEqual(0, accessor.view.value, "default to 0 on parse errors")
    });

    it("converts strings to bools", () => {
        const accessor = new TestCheckedValueAccessor()

        accessor.writeValue(null);
        assert.strictEqual(false, accessor.view.checked, "default to false on empty")

        accessor.writeValue("true");
        assert.strictEqual(true, accessor.view.checked)

        accessor.writeValue("blah");
        assert.strictEqual(false, accessor.view.checked, "default to false on parse errors")
    });

    it("converts strings to dates", () => {
        const now = new Date();
        const accessor = new TestDateValueAccessor()

        accessor.writeValue(null);
        assert.equal(formatDate(now), formatDate(accessor.view.date), "default to now on empty")

        accessor.writeValue("2010-03-17");
        assert.equal(formatDate(new Date(2010, 2, 17)), formatDate(accessor.view.date))

        accessor.writeValue("a fortnight ago");
        assert.equal(formatDate(now), formatDate(accessor.view.date), "default to now on parse error")
    });

    it("converts strings to int selection", () => {
        const accessor = new TestSelectedIndexValueAccessor()

        accessor.writeValue(null);
        assert.strictEqual(0, accessor.view.selectedIndex, "default to 0 on empty")

        accessor.writeValue("3");
        assert.strictEqual(3, accessor.view.selectedIndex)

        accessor.writeValue("blah");
        assert.strictEqual(0, accessor.view.selectedIndex, "default to 0 on parse errors")
    });

    it("converts strings to times", () => {
        const now = new Date();
        const accessor = new TestTimeValueAccessor()

        accessor.writeValue(null);
        assert.equal(formatTime(now), formatTime(accessor.view.time), "default to now on empty")

        accessor.writeValue("2010/03/17 12:54");
        assert.equal(formatTime(new Date(2010, 2, 17, 12, 54)), formatTime(accessor.view.time))

        accessor.writeValue("three hours from now");
        assert.equal(formatTime(now), formatTime(accessor.view.time), "default to now on parse error")
    });

    it("converts values to text", () => {
        const now = new Date();
        const accessor = new TestTextValueAccessor()

        accessor.writeValue(null);
        assert.equal("", accessor.view.text);

        accessor.writeValue("blah");
        assert.equal("blah", accessor.view.text);

        accessor.writeValue({toString: () => "stringified"});
        assert.equal("stringified", accessor.view.text);
    });
})

function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatTime(date: Date) {
    return `${date.getHours()}:${date.getMinutes()}`;
}
