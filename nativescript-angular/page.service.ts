import { OnDestroy, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { NavigatedData, Page } from '@nativescript/core/ui/page';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageService implements OnDestroy {
    private _inPage$ = new BehaviorSubject<boolean>(false);
    private _pageEvents$ = new Subject<NavigatedData>();

    get inPage(): boolean { return this._inPage$.value; }
    get inPage$(): Observable<boolean> { return this._inPage$.pipe(distinctUntilChanged()); }
    get pageEvents$(): Observable<NavigatedData> { return this._pageEvents$.asObservable(); }
    constructor(public page: Page) {
        if (this.page) {
            this.page.on('navigatedFrom', this.pageEvent, this);
            this.page.on('navigatedTo', this.pageEvent, this);
            this.page.on('navigatingFrom', this.pageEvent, this);
            this.page.on('navigatingTo', this.pageEvent, this);
        }
    }

    ngOnDestroy() {
        if (this.page) {
            this.page.off('navigatedFrom', this.pageEvent, this);
            this.page.off('navigatedTo', this.pageEvent, this);
            this.page.off('navigatingFrom', this.pageEvent, this);
            this.page.off('navigatingTo', this.pageEvent, this);
        }
        this._inPage$.complete();
        this._pageEvents$.complete();
    }

    private pageEvent(evt: NavigatedData) {
        this._pageEvents$.next(evt);
        switch (evt.eventName) {
            case 'navigatedTo':
                this._inPage$.next(true);
                break;
            case 'navigatedFrom':
                this._inPage$.next(false);
                break;
            default:
        }
    }
}
