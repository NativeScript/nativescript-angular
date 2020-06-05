import { platformNativeScriptDynamic } from "@nativescript/angular/platform";
import { animationsTraceCategory } from "@nativescript/angular/trace";
import { setCategories, enable } from "@nativescript/core/trace";
import {
  GridLayout,
  ItemSpec,
  GridUnitType,
} from '@nativescript/core/ui/layouts/grid-layout';
import {
  HorizontalAlignment,
  VerticalAlignment,
} from '@nativescript/core/ui/enums/enums';

import { AppModule } from "./app.module";

setCategories(animationsTraceCategory);
enable();

class LaunchAnimation extends GridLayout {
  circle: GridLayout;
  animatedContainer: GridLayout;
  finished = false;

  constructor() {
    super();

    // setup container to house launch animation
    this.animatedContainer = new GridLayout();
    this.animatedContainer.style.zIndex = 100;
    this.animatedContainer.backgroundColor = '#4caef7';
    this.animatedContainer.className = 'w-full h-full';

    // any creative animation can be put inside
    this.circle = new GridLayout();
    this.circle.width = 30;
    this.circle.height = 30;
    this.circle.borderRadius = 15;
    this.circle.horizontalAlignment = HorizontalAlignment.center;
    this.circle.verticalAlignment = VerticalAlignment.center;
    this.circle.backgroundColor = '#fff';
    this.animatedContainer.addRow(new ItemSpec(1, GridUnitType.STAR));
    this.animatedContainer.addRow(new ItemSpec(1, GridUnitType.AUTO));
    this.animatedContainer.addRow(new ItemSpec(1, GridUnitType.STAR));
    GridLayout.setRow(this.circle, 1);
    this.animatedContainer.addChild(this.circle);

    // add animation to top row since booted app will insert into bottom row
    GridLayout.setRow(this.animatedContainer, 1);
    this.addChild(this.animatedContainer);
  }

  startAnimation() {
    this.circle
      .animate({
        scale: { x: 2, y: 2 },
        duration: 800,
      })
      .then(() => {
        this.circle
          .animate({
            scale: { x: 1, y: 1 },
            duration: 800,
          })
          .then(() => {
            if (this.finished) {
              this.circle
                .animate({
                  scale: { x: 30, y: 30 },
                  duration: 400,
                })
                .then(() => {
                  this.fadeOut();
                });
            } else {
              // keep looping
              this.startAnimation();
            }
          });
      });
  }

  cleanup() {
    this.finished = true;
  }

  fadeOut() {
    this.animatedContainer
      .animate({
        opacity: 0,
        duration: 400,
      })
      .then(() => {
        this._removeView(this.animatedContainer);
        this.animatedContainer = null;
        this.circle = null;
      });
  }
}

platformNativeScriptDynamic({
  launchView: new LaunchAnimation(),
  // backgroundColor: 'purple'
}).bootstrapModule(AppModule);
