import * as trace from "trace";

export const CATEGORY = "ns-router";

export function log(message: string) {
    trace.write(message, CATEGORY);
}
