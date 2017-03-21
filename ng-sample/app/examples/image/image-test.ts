import { Component } from "@angular/core";

/* IMPORTANT
In order to test out the full image example,
to fix the App Transport Security error in iOS 9,
you will need to follow this after adding the iOS platform:

https://blog.nraboy.com/2015/12/fix-ios-9-app-transport-security-issues-in-nativescript/
*/

@Component({
    selector: "image-test",
    template: `
    <StackLayout horizontalAlignment="center">
        <Image [src]="currentImage" width="300" height="300"></Image>
        <GridLayout columns="*, *" rows="auto">
          <Button text="Previous" (tap)="changeImage(-1)" row="0" col="0" cssClass="btn"></Button>
          <Button text="Next" (tap)="changeImage(1)" row="0" col="1" cssClass="btn"></Button>
        </GridLayout>
        
        <TextField #url hint="Enter URL to any image" cssClass="input"></TextField>
        <Button text="Add Image" (tap)='addImage($event, url.text)' cssClass="btn-primary"></Button>
    </StackLayout>
    `
})
export class ImageTest {

  public currentImage: string;
  private images: Array<string> = [
    "res://300x300.jpg",
    "~/examples/image/img/Default.png",
    "http://www.codeproject.com/KB/mobile/883465/NativeScript.png"
  ];
  private cnt: number = 0;

  constructor() {
    this.currentImage = this.images[this.cnt];
  }

  changeImage(direction: number) {
    if (direction > 0) {
      this.cnt++;
    } else {
      this.cnt--;
    }
    if (this.cnt === this.images.length) {
      // start over
      this.cnt = 0;
    } else if (this.cnt < 0) {
      // go to end
      this.cnt = this.images.length - 1;
    }
    this.currentImage = this.images[this.cnt];
  }

  addImage(e: any, name: string): void {
    if (name.indexOf("http") === -1) {
      alert(`Must be a valid url to an image starting with 'http'!`);
    } else {
      this.images.push(name);
      this.currentImage = this.images[this.images.length - 1];
    }
  }
}
