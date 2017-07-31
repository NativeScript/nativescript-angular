import { write, categories, messageType } from "tns-core-modules/trace";

export const animationsTraceCategory = "ns-animations";
export const rendererTraceCategory = "ns-renderer";
export const routerTraceCategory = "ns-router";
export const listViewTraceCategory = "ns-list-view";

export function animationsLog(message: string): void {
    write(message, animationsTraceCategory);
}

export function rendererLog(msg): void {
    write(msg, rendererTraceCategory);
}

export function rendererError(message: string): void {
    write(message, rendererTraceCategory, messageType.error);
}

export function routerLog(message: string): void {
    write(message, routerTraceCategory);
}

export function styleError(message: string): void {
    write(message, categories.Style, messageType.error);
}

export function listViewLog(message: string): void {
    write(message, listViewTraceCategory);
}

export function listViewError(message: string): void {
    write(message, listViewTraceCategory, messageType.error);
}
