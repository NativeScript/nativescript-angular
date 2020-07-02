import { Injectable } from "@angular/core";
import { Frame } from "@nativescript/core/ui/frame";

@Injectable({
  providedIn: 'root'
})
export class FrameService {
    // TODO: Add any methods that are needed to handle frame/page navigation
    getFrame(): Frame {
        let topmostFrame = Frame.topmost();
        return topmostFrame;
    }
}