import { ContentView, View, ProxyViewContainer, GridLayout } from '@nativescript/core';

export class AppHostView extends ContentView {

    private _ngAppRoot: View;
    private _content: View;

    get ngAppRoot(): View {
        return this._ngAppRoot;
    }

    set ngAppRoot(value: View) {
        this._ngAppRoot = value;
    }

    get content(): View {
        return this._content;
    }

    set content(value: View) {
        if (this._content) {
            this._content.parentNode = undefined;
        }

        this._content = value;

        if (value) {
            this._content.parentNode = <any>this;
        }

        this.ngAppRoot = value;

        if (this._content instanceof ProxyViewContainer) {
            const grid = new GridLayout();
            grid.addChild(this._content);
            this.ngAppRoot = grid;
        }
    }

}
