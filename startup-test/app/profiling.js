exports.ENABLE_PROFILING = true;
function time() {
    if (!exports.ENABLE_PROFILING) {
        return;
    }
    if (global.android) {
        return java.lang.System.nanoTime() / 1000000; // 1 ms = 1000000 ns
    }
    else {
        return CACurrentMediaTime() * 1000;
    }
}
exports.time = time;
var timers = new Map();
function start(name) {
    if (!exports.ENABLE_PROFILING) {
        return;
    }
    var info;
    if (timers.has(name)) {
        info = timers.get(name);
        if (info.currentStart != 0) {
            throw new Error("Timer already started: " + name);
        }
        info.currentStart = time();
    }
    else {
        info = {
            totalTime: 0,
            count: 0,
            currentStart: time()
        };
        timers.set(name, info);
    }
}
exports.start = start;
function pause(name) {
    if (!exports.ENABLE_PROFILING) {
        return;
    }
    var info = pauseInternal(name);
    console.log("---- [" + name + "] PAUSE last: " + info.lastTime + " total: " + info.totalTime + " count: " + info.count);
}
exports.pause = pause;
function stop(name) {
    if (!exports.ENABLE_PROFILING) {
        return;
    }
    var info = pauseInternal(name);
    console.log("---- [" + name + "] STOP total: " + info.totalTime + " count:" + info.count);
    timers.delete(name);
}
exports.stop = stop;
function pauseInternal(name) {
    var info = timers.get(name);
    if (!info) {
        throw new Error("No timer started: " + name);
    }
    info.lastTime = Math.round(time() - info.currentStart);
    info.totalTime += info.lastTime;
    info.count++;
    info.currentStart = 0;
    return info;
}
function startCPUProfile(name) {
    if (!exports.ENABLE_PROFILING) {
        return;
    }
    if (global.android) {
        __startCPUProfiler(name);
    }
}
exports.startCPUProfile = startCPUProfile;
function stopCPUProfile(name) {
    if (!exports.ENABLE_PROFILING) {
        return;
    }
    if (global.android) {
        __stopCPUProfiler(name);
    }
}
exports.stopCPUProfile = stopCPUProfile;
