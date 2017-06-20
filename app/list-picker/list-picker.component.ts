import { Component,Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'list',
    styleUrls: ['./list-picker.css'],
    template: ` 
                <StackLayout automationText="listPicker" >
                    <ListPicker #picker class="listPicker"
                        [items]="pokemons" [selectedIndex]="selectedIndex" 
                        (selectedIndexChange)="selectedIndexChanged(picker)">
                    </ListPicker>
                </StackLayout>
            `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListPickerComponent {
    public pokemons: Array<string>;
    public picked: string;
    public selectedIndex: number;

    private pokemonList = ["Bulbasaur", "Parasect", "Venonat", "Venomoth", "Diglett",
"Dugtrio", "Meowth", "Persian", "Psyduck", "Arcanine", "Poliwrath", "Machoke"];

    constructor() {
        this.pokemons = [];

        for (let i = 0; i < this.pokemonList.length; i++) {
            this.pokemons.push(this.pokemonList[i]);
        }
    }

    public selectedIndexChanged(picker) {
        console.log("picker selection: " + picker.selectedIndex);
        this.picked = this.pokemons[picker.selectedIndex];
    }
}
