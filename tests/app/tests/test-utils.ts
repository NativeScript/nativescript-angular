import {View} from "ui/core/view";
import {TextBase} from "ui/text-base";

function getChildren(view: View): Array<View> {
    var children: Array<View> = [];
    (<any>view)._eachChildView((child) => {
        children.push(child);
        return true;
    });
    return children;
}

export function dumpView(view: View, verbose: boolean = false): string {
    let nodeName = (<any>view).nodeName || view;
    let output = ["(", nodeName];
    if (verbose) {
        if (view instanceof TextBase) {
            output.push("[text=", view.text, "]")
        }
    }

    let children = getChildren(view).map((c) => dumpView(c, verbose)).join(", ");
    if (children) {
        output.push(" ", children);
    }

    output.push(")");
    return output.join("");
}
