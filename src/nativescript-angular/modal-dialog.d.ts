import {Type} from 'angular2/core';

export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
}

export class ModalDialogParams {
    public context: any;
    public closeCallback: (...args) => any;
}

export class ModalDialogService {
    public showModal(type: Type, options: ModalDialogOptions): Promise<any>;
}

export class ModalDialogHost {
} 
