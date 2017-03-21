declare var java: any;
declare var CACurrentMediaTime: any;

let anyGlobal = <any>global;

if (!anyGlobal.timers) {
    anyGlobal.timers = new Map();
}

function time() {
    if (anyGlobal.android) {
        return java.lang.System.nanoTime() / 1000000; // 1 ms = 1000000 ns
    } else {
        return CACurrentMediaTime() * 1000;
    }
}

let timerEntry = {
    totalTime: 0,
    count: 0,
    currentStart: time()
};

anyGlobal.timers.set("application-start", timerEntry);

import "./app.js";
