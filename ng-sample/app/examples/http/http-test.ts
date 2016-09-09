import {Component} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/* IMPORTANT
In order to test out the full image example, to fix the App Transport Security error in iOS 9, you will need to follow this after adding the iOS platform:

https://blog.nraboy.com/2015/12/fix-ios-9-app-transport-security-issues-in-nativescript/
*/

@Component({
    selector: 'http-test',
    template: `
    <StackLayout horizontalAlignment="center">
        <Button text="Load Local File with Http" (tap)='loadLocal()' cssClass="btn-primary"></Button>
        <Button text="Load Remote File with Http" (tap)='loadRemote()' cssClass="btn-primary"></Button>
        <Label [text]="title" textWrap="true"></Label>
        <Label [text]="description" textWrap="true"></Label>
    </StackLayout>
    `,
    styles: [
      `Button {
        margin-bottom:20;
      }`
    ],
})
export class HttpTest {
  public title: string;
  public description: string;

  constructor(private http: Http) { 
   
  }
  
  public loadLocal() {
    this.http.get('~/examples/http/data.json').map(res => res.json()).subscribe((response: any) => {
      let user = response.results[0];
      this.title = user.title;
      this.description = user.description;
    });
  }

  public loadRemote() {
    this.http.get(`https://randomuser.me/api/?results=1&nat=us`).map(res => res.json()).subscribe((response: any) => {
      let user = response.results[0];
      this.title = user.name.first;
      this.description = user.email;
    });
  }
}
