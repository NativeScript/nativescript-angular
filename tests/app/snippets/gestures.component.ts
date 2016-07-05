import {Component} from "@angular/core";
import {
    GestureEventData,
    PanGestureEventData,
    PinchGestureEventData,
    RotationGestureEventData,
    SwipeGestureEventData,
    TouchGestureEventData} from "ui/gestures";

@Component({
    selector: "gestures",
    templateUrl: "snippets/gestures.component.html",
    styles:['label { font-size: 32; margin: 2; background-color: lightgreen;}']
})
export class GestureComponent {
    
    // >> ng-tap-gesture-ts
    onTap(args: GestureEventData) {
        console.log("Tap!")
    }
    // << ng-tap-gesture-ts
    
    // >> ng-double-tap-gesture
    onDoubleTap(args: GestureEventData) {
        console.log("DoubleTap!")

    }
    // << ng-double-tap-gesture-ts
    
    // >> ng-long-press-gesture-ts
    onLongPress(args: GestureEventData) {
        console.log("LongPress!")
    }
    // << ng-long-press-gesture-ts
    
    // >> ng-swipe-gesture
    onSwipe(args: SwipeGestureEventData) {
        console.log("Swipe Direction: " + args.direction);
    }
    // << ng-swipe-gesture-ts
    
    // >> ng-pan-gesture-ts
    onPan(args: PanGestureEventData) {
        console.log("Pan delta: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);
    }
    // << ng-pan-gesture-ts
    
    // >> ng-pinch-gesture-ts
    onPinch(args: PinchGestureEventData) {
        console.log("Pinch scale: " + args.scale + " state: " + args.state);
    }
    // << ng-pinch-gesture-ts
    
    // >> ng-rotate-gesture-ts
    onRotate(args: RotationGestureEventData) {
        console.log("Rotate angle: " + args.rotation + " state: " + args.state);
    }
    // << ng-rotate-gesture-ts
    
    // >> ng-touch-gesture-ts
    onTouch(args: TouchGestureEventData) {
        console.log("Touch point: [" + args.getX() + ", " + args.getY() + "] activePointers: " + args.getActivePointers().length);
    } 
    // << ng-touch-gesture-ts
}
