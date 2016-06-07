import {write, categories, messageType} from "trace";

export const rendererTraceCategory = "ns-renderer";
export const routerTraceCategory = "ns-router";

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
