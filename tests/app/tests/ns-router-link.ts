import {NSRouterLink} from "nativescript-angular/router/ns-router-link";
import {ActivatedRoute, Router} from "@angular/router";
import {RouterExtensions} from "nativescript-angular/router";
import {assert, fake, spy, stub} from "./test-config";
import {SinonStub} from "sinon";

describe("NSRouterLink", () => {

    const mockRouter = {} as Router;
    let mockRouterExtensions = {
        navigateByUrl: fake()
    };
    const mockActivatedRoute = {} as ActivatedRoute;
    let nsRouterLink: NSRouterLink;
    let urlTreeStub: SinonStub;

    beforeEach(() => {
        nsRouterLink = new NSRouterLink(mockRouter, mockRouterExtensions as unknown as RouterExtensions, mockActivatedRoute);
        urlTreeStub = stub(nsRouterLink, 'urlTree').get(() => null);
    });

    afterEach(() => {
        urlTreeStub.restore();
    });

    it('#tap should call navigateByUrl with undefined transition in extras when boolean is given for pageTransition input', () => {
        nsRouterLink.pageTransition = false;
        nsRouterLink.onTap();
        assert.isUndefined(mockRouterExtensions.navigateByUrl.lastCall.args[1].transition);
    });

    it('#tap should call navigateByUrl with correct transition in extras when NavigationTransition object is given for pageTransition input', () => {
        const pageTransition = {
            name: 'slide',
            duration: 500
        };
        nsRouterLink.pageTransition = pageTransition;
        stub(nsRouterLink, 'urlTree').get(() => null);
        nsRouterLink.onTap();
        assert.equal(pageTransition, mockRouterExtensions.navigateByUrl.lastCall.args[1].transition);
    });

});
