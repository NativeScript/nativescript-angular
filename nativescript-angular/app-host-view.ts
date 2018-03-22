import { ContentView } from "tns-core-modules/ui/content-view";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { ViewBase } from "tns-core-modules/ui/core/view/view";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container";
import { View } from "tns-core-modules/ui/core/view";

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
        this._content.parentNode = this;

        this.ngAppRoot = value;

        if (this._content instanceof ProxyViewContainer) {
            const grid = new GridLayout();
            grid.addChild(this._content);
            this.ngAppRoot = grid;
        }
    }

}
