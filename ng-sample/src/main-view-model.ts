import {Observable} from "data/observable";

export class HelloWorldModel extends Observable {
    public counter: number;

    constructor() {
        super();
        this.counter = 5;
        this.set("message", this.counter + " taps left");
    }

    public tapAction() {
        this.counter--;
        if (this.counter <= 0) {
            this.set("message", "Hoorraaay! Clicker achievement unlocked!");
        } else {
            this.set("message", `${this.counter} taps left`);
        }
    };
};
