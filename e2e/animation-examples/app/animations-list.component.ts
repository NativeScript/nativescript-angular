import { Component } from '@angular/core';

class Link {
    constructor(public title: string, public link: string, public id?: string) {
        this.id = this.id || this.link.replace("/", "");
    }
}

@Component({
    template: `
        <WrapLayout [items]="links">
            <Button
                *ngFor="let item of links"
                [text]="item.title"
                [nsRouterLink]="item.link"
                [automationText]="item.link.replace('/', '')">
            </Button>
        </WrapLayout>
    `
})
export class AnimationsListComponent {
    public links: Link[] = [
        new Link("Animation builder", "/builder"),
        new Link("External animation", "/external"),
        new Link("Selector", "/selector"),
        new Link("Query with stagger", "/query-stagger"),
        new Link("Fade in/out animation", "/fade-in-out"),
        new Link("Animation with options", "/options"),
        new Link("Animation with default options", "/options-default"),
        new Link("Animate child", "/animate-child"),
        new Link("Angular docs animations", "/hero"),
    ]
}
