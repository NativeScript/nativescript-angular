import { Injectable } from "@angular/core";
import { TestComponentRenderer } from "@angular/core/testing";
import { topmost } from "tns-core-modules/ui/frame";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container";

/**
 * A NativeScript based implementation of the TestComponentRenderer.
 */
@Injectable()
export class NativeScriptTestComponentRenderer extends TestComponentRenderer {

  insertRootElement(rootElId: string) {
    const page = topmost().currentPage;

    const layout = new ProxyViewContainer();
    layout.id = rootElId;

    const rootLayout = page.layoutView as LayoutBase;
    rootLayout.addChild(layout);
  }

}

