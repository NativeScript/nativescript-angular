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
    
    // >> tap-gesture
    onTap(args: GestureEventData) {
        console.log("Tap!")
    }
    // << tap-gesture
    
    // >> double-tap-gesture
    onDoubleTap(args: GestureEventData) {
        console.log("DoubleTap!")

    }
    // << double-tap-gesture
    
    // >> long-press-gesture
    onLongPress(args: GestureEventData) {
        console.log("LongPress!")
    }
    // << long-press-gesture
    
    // >> swipe-gesture
    onSwipe(args: SwipeGestureEventData) {
        console.log("Swipe Direction: " + args.direction);
    }
    // << swipe-gesture
    
    // >> pan-gesture
    onPan(args: PanGestureEventData) {
        console.log("Pan delta: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);
    }
    // << pan-gesture
    
    // >> pinch-gesture
    onPinch(args: PinchGestureEventData) {
        console.log("Pinch scale: " + args.scale + " state: " + args.state);
    }
    // << pinch-gesture
    
    // >> rotate-gesture
    onRotate(args: RotationGestureEventData) {
        console.log("Rotate angle: " + args.rotation + " state: " + args.state);
    }
    // << rotate-gesture
    
    // >> touch-gesture
    onTouch(args: TouchGestureEventData) {
        console.log("Touch point: [" + args.getX() + ", " + args.getY() + "] activePointers: " + args.getActivePointers().length);
    } 
    // << touch-gesture   
}
