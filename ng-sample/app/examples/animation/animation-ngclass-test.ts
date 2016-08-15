import {Component} from "@angular/core";
import {Observable} from "data/observable";

@Component({
    selector: "main-component",
    templateUrl: "./examples/animation/animation-ngClass-test.html",
    styleUrls: [ "./examples/animation/animation-ngClass-test.css" ]
})
export class AnimationNgClassTest {

    isOn = false;
    text = "Normal";

    onTap() {
        this.isOn = !this.isOn;
        if (this.isOn) {
            this.text = "Toggled";
        }
        else {
            this.text = "Normal";
        }
    }
}