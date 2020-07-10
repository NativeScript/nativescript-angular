import { Trace } from '@nativescript/core';

export namespace NativeScriptDebug {
  export const animationsTraceCategory = 'ns-animations';
  export const rendererTraceCategory = 'ns-renderer';
  export const viewUtilCategory = 'ns-view-util';
  export const routerTraceCategory = 'ns-router';
  export const routeReuseStrategyTraceCategory = 'ns-route-reuse-strategy';
  export const listViewTraceCategory = 'ns-list-view';
  export const bootstrapCategory = 'bootstrap';
  // TODO: migrate all usage to this - avoids extraneous method executions
  export const enabled = Trace.isEnabled();

  export function isLogEnabled() {
    return Trace.isEnabled();
  }

  export function animationsLog(message: string): void {
      Trace.write(message, animationsTraceCategory);
  }

  export function rendererLog(msg): void {
      Trace.write(msg, rendererTraceCategory);
  }

  export function rendererError(message: string): void {
      Trace.write(message, rendererTraceCategory, Trace.messageType.error);
  }

  export function viewUtilLog(msg): void {
      Trace.write(msg, viewUtilCategory);
  }

  export function routerLog(message: string): void {
      Trace.write(message, routerTraceCategory);
  }

  export function routerError(message: string): void {
      Trace.write(message, routerTraceCategory, Trace.messageType.error);
  }

  export function routeReuseStrategyLog(message: string): void {
      Trace.write(message, routeReuseStrategyTraceCategory);
  }

  export function styleError(message: string): void {
      Trace.write(message, Trace.categories.Style, Trace.messageType.error);
  }

  export function listViewLog(message: string): void {
      Trace.write(message, listViewTraceCategory);
  }

  export function listViewError(message: string): void {
      Trace.write(message, listViewTraceCategory, Trace.messageType.error);
  }

  export function bootstrapLog(message: string): void {
      Trace.write(message, bootstrapCategory);
  }

  export function bootstrapLogError(message: string): void {
      Trace.write(message, bootstrapCategory, Trace.messageType.error);
  }
}
