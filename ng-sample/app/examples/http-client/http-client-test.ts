import { Component, Inject, Injectable } from "@angular/core";
import {
    HttpClient, HTTP_INTERCEPTORS, HttpEventType, HttpErrorResponse,
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`[CustomInterceptor] intercept url: ${req.url}`);

        return next.handle(req)
            .do(event => {
                console.log(`[CustomInterceptor] handled type: ${HttpEventType[event.type]} url: ${req.url}`);
            });
    }
}

interface DataResults<T> {
    results: Array<T>;
}

interface LocalData {
    title: string;
    description: string;
}

interface RemoteData {
    name: { first: string };
    email: string;
}

@Component({
    selector: "http-client-test",
    template: `
    <StackLayout horizontalAlignment="center">
        <Button text="Load Local File" (tap)='loadLocal()' cssClass="btn-primary"></Button>
        <Button text="Load Remote File" (tap)='loadRemote()' cssClass="btn-primary"></Button>

        <Button text="Load Non-existent Local File" (tap)='loadNonexistentLocal()' cssClass="btn-primary"></Button>
        <Button text="Load Non-existent Remote File" (tap)='loadNonexistentRemote()' cssClass="btn-primary"></Button>

        <Label [text]="title" textWrap="true" id="title"></Label>
        <Label [text]="description" textWrap="true"></Label>
        <Label [text]="error" color="red" textWrap="true"></Label>
    </StackLayout>
    `,
    styles: [`
        #title { margin-top:20; }
        Label { margin: 5 20; }
    `],
})
export class HttpClientTest {
    static providers = [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomInterceptor,
            multi: true,
        }
    ];

    public title: string;
    public description: string;
    public error: string;

    constructor(private http: HttpClient) {
    }

    public loadLocal() {
        this.http.get<DataResults<LocalData>>("~/examples/http/data.json")
            .subscribe((response) => {
                let user = response.results[0];
                this.onSuccess(user.title, user.description);
            }, (error) => {
                this.onError(error);
            });
    }

    public loadRemote() {
        this.http.get<DataResults<RemoteData>>(`https://randomuser.me/api/?results=1&nat=us`)
            .subscribe((response) => {
                const user = response.results[0];
                this.onSuccess(user.email, user.name.first);
            }, (error) => {
                this.onError(error);
            });
    }

    public loadNonexistentLocal() {
        this.http.get<DataResults<LocalData>>("~/non/existent/app/folder/data.json")
            .subscribe((response) => {
                this.onSuccess("strange?!", "");
            }, (error) => {
                this.onError(error);
            });
    }

    public loadNonexistentRemote() {
        this.http.get<DataResults<RemoteData>>("https://google.com/non/existent/url/data.json")
            .subscribe((response) => {
                this.onSuccess("strange?!", "");
            }, (error) => {
                this.onError(error);
            });
    }

    private onSuccess(title: string, description: string) {
        this.title = title;
        this.description = description;
        this.error = "";
    }

    private onError(error: HttpErrorResponse) {
        console.log("onError " + error);
        console.dir(error);
        this.title = "";
        this.description = "";
        this.error = error.message;
    }
}
