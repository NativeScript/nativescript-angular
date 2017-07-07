import { Component } from "@angular/core";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/animation-ngclass-test.html",
    styleUrls: [ "./examples/animation/animation-ngclass-test.css" ]
})
export class AnimationNgClassTest {

    isOn = false;
    text = "Normal";

    onTap() {
        this.isOn = !this.isOn;
        this.text = this.isOn ? "Toggled" : "Normal";
    }
}
