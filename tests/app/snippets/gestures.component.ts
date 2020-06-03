import {Component} from "@angular/core";
import {
    GestureEventData,
    PanGestureEventData,
    PinchGestureEventData,
    RotationGestureEventData,
    SwipeGestureEventData,
    TouchGestureEventData} from "@nativescript/core/ui/gestures";

@Component({
    selector: "gestures",
    moduleId: module.id,
    templateUrl: "gestures.component.html",
    styles: ["label { font-size: 32; margin: 2; background-color: lightgreen;}"]
})
export class GestureComponent {

    // >> ng-tap-gesture
    onTap(args: GestureEventData) {
        console.log("Tap!");
    }
    // << ng-tap-gesture

    // >> ng-double-tap-gesture
    onDoubleTap(args: GestureEventData) {
        console.log("DoubleTap!");

    }
    // << ng-double-tap-gesture

    // >> ng-long-press-gesture
    onLongPress(args: GestureEventData) {
        console.log("LongPress!");
    }
    // << ng-long-press-gesture

    // >> ng-swipe-gesture
    onSwipe(args: SwipeGestureEventData) {
        console.log("Swipe Direction: " + args.direction);
    }
    // << ng-swipe-gesture

    // >> ng-pan-gesture
    onPan(args: PanGestureEventData) {
        console.log("Pan delta: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);
    }
    // << ng-pan-gesture

    // >> ng-pinch-gesture
    onPinch(args: PinchGestureEventData) {
        console.log("Pinch scale: " + args.scale + " state: " + args.state);
    }
    // << ng-pinch-gesture

    // >> ng-rotate-gesture
    onRotate(args: RotationGestureEventData) {
        console.log("Rotate angle: " + args.rotation + " state: " + args.state);
    }
    // << ng-rotate-gesture

    // >> ng-touch-gesture
    onTouch(args: TouchGestureEventData) {
        console.log(
            "Touch point: [" + args.getX() + ", " + args.getY() +
            "] activePointers: " + args.getActivePointers().length);
    }
    // << ng-touch-gesture
}
