import { write, categories, messageType, isEnabled } from "@nativescript/core/trace";

export namespace NativeScriptDebug {
  export const animationsTraceCategory = "ns-animations";
  export const rendererTraceCategory = "ns-renderer";
  export const viewUtilCategory = "ns-view-util";
  export const routerTraceCategory = "ns-router";
  export const routeReuseStrategyTraceCategory = "ns-route-reuse-strategy";
  export const listViewTraceCategory = "ns-list-view";
  export const bootstrapCategory = "bootstrap";
  // TODO: migrate all usage to this - avoids extraneous method executions
  export const enabled = isEnabled();

  export function isLogEnabled() {
    return isEnabled();
  }
  
  export function animationsLog(message: string): void {
      write(message, animationsTraceCategory);
  }
  
  export function rendererLog(msg): void {
      write(msg, rendererTraceCategory);
  }
  
  export function rendererError(message: string): void {
      write(message, rendererTraceCategory, messageType.error);
  }
  
  export function viewUtilLog(msg): void {
      write(msg, viewUtilCategory);
  }
  
  export function routerLog(message: string): void {
      write(message, routerTraceCategory);
  }
  
  export function routerError(message: string): void {
      write(message, routerTraceCategory, messageType.error);
  }
  
  export function routeReuseStrategyLog(message: string): void {
      write(message, routeReuseStrategyTraceCategory);
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
  
  export function bootstrapLog(message: string): void {
      write(message, bootstrapCategory);
  }
  
  export function bootstrapLogError(message: string): void {
      write(message, bootstrapCategory, messageType.error);
  }
}
