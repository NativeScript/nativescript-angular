declare var java: any;
declare var CACurrentMediaTime: any;

if (!global.timers) {
    global.timers = new Map();
}

function time() {
    if (global.android) {
        return java.lang.System.nanoTime() / 1000000; // 1 ms = 1000000 ns
    }
    else {
        return CACurrentMediaTime() * 1000;
    }
}

var timerEntry = {
    totalTime: 0,
    count: 0,
    currentStart: time()
};

global.timers.set("application-start", timerEntry);

import "./app.js"
