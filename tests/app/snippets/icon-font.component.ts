import {Component} from "@angular/core";

// >> icon-font-sample
@Component({
    // >> (hide)
    selector: "icon-font",
    moduleId: module.id,
    templateUrl: "icon-font.component.html",
    styleUrls: ["icon-font.component.css"]
    // << (hide)
    // ...
})
export class IconFontComponent {
    public glyphs = new Array<{ icon: string, code: string }>();
    constructor() {
        for (let charCode = 0xe903; charCode <= 0xeaea; charCode++) {
            let glyph = {
                icon: String.fromCharCode(charCode),
                code: charCode.toString(16)
            };
            this.glyphs.push(glyph);
        }
    }
}
// << icon-font-sample
