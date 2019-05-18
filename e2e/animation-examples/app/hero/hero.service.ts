import { Injectable } from "@angular/core";

class Hero {
    constructor(
        public name: string,
        public state = "inactive"
    ) { }

        toggleState() {
            this.state = (this.state === "active" ? "inactive" : "active");
        }
}

let ALL_HEROES = [
    "Windstorm",
    "RubberMan",
    "Bombasto",
    "Magneta",
    "Dynama",
    "Narco",
    "Celeritas",
    "Dr IQ",
    "Magma",
    "Tornado",
    "Mr. Nice"
].map(name => new Hero(name));

@Injectable()
export class Heroes implements Iterable<Hero> {

    currentHeroes: Hero[] = [new Hero("Narco")];

    [Symbol.iterator]() {
        return makeIterator(this.currentHeroes);
    }

    addActive() {
        let hero = ALL_HEROES[this.currentHeroes.length];
        hero.state = "active";
        this.currentHeroes.push(hero);
    }

    addInactive() {
        let hero = ALL_HEROES[this.currentHeroes.length];
        hero.state = "inactive";
        this.currentHeroes.push(hero);
    }

    remove() {
        if (this.currentHeroes.length) {
            this.currentHeroes.splice(this.currentHeroes.length - 1, 1);
        }
    }

    reset() {
        this.currentHeroes = [];
    }
}

function makeIterator(array) {
    let nextIndex = 0;

    return {
        next: function() {
            return nextIndex < array.length ?
                { value: array[nextIndex++], done: false } :
                { value: "empty", done: true };
        }
    };
}
