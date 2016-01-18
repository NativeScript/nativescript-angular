import {
    NgView,
    ViewExtensions,
    getChildIndex,
    insertChild,
    removeChild
} from "./view-util";
import {ContentView} from "ui/content-view";

//var console = {log: function(msg) {}}

export class ViewContainer extends ContentView implements ViewExtensions {
    public nodeName = "ViewContainer";
    public templateParent: NgView = null;
    public cssClasses = new Map<string, boolean>();

    public children: Array<NgView> = [];

    private _anchorIndex = -1;
    private _visualParent: NgView = null;

    constructor() {
        super();
        this.on('unloaded', () => this.clearChildren());
    }

    public addedToView() {
        //Invalidate anchor index.
        this._anchorIndex = -1;
        this._visualParent = null;
        this.attachChildrenToParent();
    }

    private get anchorIndex(): number{
        if (this._anchorIndex === -1) {
            this._anchorIndex = getChildIndex(this.parent, this);
            console.log('Got anchorIndex: ' + this._anchorIndex + ' - ' + this.parent + ' - ' + this + ' --- ' + (<any>this.parent)._subViews);
        }
        return this._anchorIndex;
    }

    private get visualParent(): NgView {
        if (this._visualParent === null) {
            if (this.parent instanceof ViewContainer) {
                this._visualParent = (<ViewContainer>this.parent).visualParent;
            } else {
                this._visualParent = <NgView>this.parent;
            }
        }
        return this._visualParent;
    }

    private getParentIndex(childIndex: number): number {
        if (childIndex !== -1) {
            return this.anchorIndex + childIndex;
        } else {
            return this.anchorIndex + this.children.length;
        }
    }

    public getChildIndex(child: NgView) {
        return this.children.indexOf(child);
    }

    insertChild(child: NgView, atIndex = -1) {
        console.log('insert component child: ' + child + ', ' + atIndex);
        if (atIndex !== -1) {
            this.children.splice(atIndex, 0, child);
        } else {
            this.children.push(child);
        }

        if (this.parent) {
            const parentIndex = this.getParentIndex(atIndex);
            console.log('actually inserting in: ' + this.parent + ', ' + parentIndex);
            insertChild(this.parent, child, parentIndex)
            child.templateParent = this;
        }
    }

    private attachChildToParent(child: NgView, atIndex: number) {
        const parentIndex = this.getParentIndex(atIndex);
        console.log('attaching: ' + child + ' to: ' + this.parent + ' at ' + parentIndex + '/' + atIndex);
        insertChild(this.parent, child, parentIndex)
    }

    private attachChildrenToParent() {
        this.children.forEach((child, index) => {
            if (!child.parent) {
                console.log('attaching pending child: ' + this + ' - ' + child);
                this.attachChildToParent(child, index);
            }
        });
    }

    removeChild(child: NgView) {
        this.children = this.children.filter((item) => item !== child);
        removeChild(this.parent, child);
    }

    clearChildren() {
        while (this.children.length > 0) {
            this.removeChild(this.children[0]);
        }
    }
}
