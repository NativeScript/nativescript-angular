import { AnimationBuilder, style, animate } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
 
@Component({
    template: `
        <Button #button (tap)="makeAnimation()" class="btn btn-primary" automationText="tapToDisappear" text="Tap to disappear!"></Button>
    `
})
export class AnimationBuilderComponent {
  @ViewChild('button', { static: false }) button;

  constructor(private _builder: AnimationBuilder) {}
 
  makeAnimation() {
    const myAnimation = this._builder.build([
      style({ "opacity": 1 }),
      animate(1000, style({ "opacity": 0 }))
    ]);
 
    const player = myAnimation.create(this.button.nativeElement);
 
    player.play();
  }
}
