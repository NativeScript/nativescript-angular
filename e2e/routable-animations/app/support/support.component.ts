import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
    moduleId: module.id,
    templateUrl: './support.component.html',
    styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

    constructor(public router: RouterExtensions) {
    }

    ngOnInit() {
    }

}
