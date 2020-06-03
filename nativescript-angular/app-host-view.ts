import { ContentView } from "@nativescript/core/ui/content-view";
import { GridLayout } from "@nativescript/core/ui/layouts/grid-layout";
import { ProxyViewContainer } from "@nativescript/core/ui/proxy-view-container";
import { View } from "@nativescript/core/ui/core/view";

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
        // TODO: WIP, determine how to handle this
        if (this._content) {
            return;
        }

        if (this._content) {
            this._content.parentNode = undefined;
        }

        this._content = value;

        if (value) {
            this._content.parentNode = this;
        }

        this.ngAppRoot = value;

        if (this._content instanceof ProxyViewContainer) {
            const grid = new GridLayout();
            grid.addChild(this._content);
            this.ngAppRoot = grid;
        }
    }

}
