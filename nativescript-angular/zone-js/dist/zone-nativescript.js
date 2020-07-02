(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (factory());
}(this, (function () {
    'use strict';
    var Zone$1 = (function (global) {
        var FUNCTION = 'function';
        var performance = global['performance'];
        function mark(name) {
            performance && performance['mark'] && performance['mark'](name);
        }
        function performanceMeasure(name, label) {
            performance && performance['measure'] && performance['measure'](name, label);
        }
        mark('Zone');
        if (global['Zone']) {
            throw new Error('Zone already loaded.');
        }
        var Zone = (function () {
            function Zone(parent, zoneSpec) {
                this._properties = null;
                this._parent = parent;
                this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
                this._properties = zoneSpec && zoneSpec.properties || {};
                this._zoneDelegate =
                    new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
            }
            Zone.assertZonePatched = function () {
                if (global['Promise'] !== patches['ZoneAwarePromise']) {
                    throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                        'has been overwritten.\n' +
                        'Most likely cause is that a Promise polyfill has been loaded ' +
                        'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                        'If you must load one, do so before loading zone.js.)');
                }
            };
            Object.defineProperty(Zone, "root", {
                get: function () {
                    var zone = Zone.current;
                    while (zone.parent) {
                        zone = zone.parent;
                    }
                    return zone;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Zone, "current", {
                get: function () {
                    return _currentZoneFrame.zone;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Zone, "currentTask", {
                get: function () {
                    return _currentTask;
                },
                enumerable: true,
                configurable: true
            });
            Zone.__load_patch = function (name, fn) {
                if (patches.hasOwnProperty(name)) {
                    throw Error('Already loaded patch: ' + name);
                }
                else if (!global['__Zone_disable_' + name]) {
                    var perfName = 'Zone:' + name;
                    mark(perfName);
                    patches[name] = fn(global, Zone, _api);
                    performanceMeasure(perfName, perfName);
                }
            };
            Object.defineProperty(Zone.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Zone.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Zone.prototype.get = function (key) {
                var zone = this.getZoneWith(key);
                if (zone)
                    return zone._properties[key];
            };
            Zone.prototype.getZoneWith = function (key) {
                var current = this;
                while (current) {
                    if (current._properties.hasOwnProperty(key)) {
                        return current;
                    }
                    current = current._parent;
                }
                return null;
            };
            Zone.prototype.fork = function (zoneSpec) {
                if (!zoneSpec)
                    throw new Error('ZoneSpec required!');
                return this._zoneDelegate.fork(this, zoneSpec);
            };
            Zone.prototype.wrap = function (callback, source) {
                if (typeof callback !== FUNCTION) {
                    throw new Error('Expecting function got: ' + callback);
                }
                var _callback = this._zoneDelegate.intercept(this, callback, source);
                var zone = this;
                return function () {
                    return zone.runGuarded(_callback, this, arguments, source);
                };
            };
            Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
                if (applyThis === void 0) {
                    applyThis = undefined;
                }
                if (applyArgs === void 0) {
                    applyArgs = null;
                }
                if (source === void 0) {
                    source = null;
                }
                _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                finally {
                    _currentZoneFrame = _currentZoneFrame.parent;
                }
            };
            Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
                if (applyThis === void 0) {
                    applyThis = null;
                }
                if (applyArgs === void 0) {
                    applyArgs = null;
                }
                if (source === void 0) {
                    source = null;
                }
                _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
                try {
                    try {
                        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                    }
                    catch (error) {
                        if (this._zoneDelegate.handleError(this, error)) {
                            throw error;
                        }
                    }
                }
                finally {
                    _currentZoneFrame = _currentZoneFrame.parent;
                }
            };
            Zone.prototype.runTask = function (task, applyThis, applyArgs) {
                if (task.zone != this) {
                    throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                        (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
                }
                var isNotScheduled = task.state === notScheduled;
                if (isNotScheduled && task.type === eventTask) {
                    return;
                }
                var reEntryGuard = task.state != running;
                reEntryGuard && task._transitionTo(running, scheduled);
                task.runCount++;
                var previousTask = _currentTask;
                _currentTask = task;
                _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
                try {
                    if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                        task.cancelFn = null;
                    }
                    try {
                        return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                    }
                    catch (error) {
                        if (this._zoneDelegate.handleError(this, error)) {
                            throw error;
                        }
                    }
                }
                finally {
                    if (task.state !== notScheduled && task.state !== unknown) {
                        if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                            reEntryGuard && task._transitionTo(scheduled, running);
                        }
                        else {
                            task.runCount = 0;
                            this._updateTaskCount(task, -1);
                            reEntryGuard &&
                                task._transitionTo(notScheduled, running, notScheduled);
                        }
                    }
                    _currentZoneFrame = _currentZoneFrame.parent;
                    _currentTask = previousTask;
                }
            };
            Zone.prototype.scheduleTask = function (task) {
                if (task.zone && task.zone !== this) {
                    var newZone = this;
                    while (newZone) {
                        if (newZone === task.zone) {
                            throw Error("can not reschedule task to " + this
                                .name + " which is descendants of the original zone " + task.zone.name);
                        }
                        newZone = newZone.parent;
                    }
                }
                task._transitionTo(scheduling, notScheduled);
                var zoneDelegates = [];
                task._zoneDelegates = zoneDelegates;
                task._zone = this;
                try {
                    task = this._zoneDelegate.scheduleTask(this, task);
                }
                catch (err) {
                    task._transitionTo(unknown, scheduling, notScheduled);
                    this._zoneDelegate.handleError(this, err);
                    throw err;
                }
                if (task._zoneDelegates === zoneDelegates) {
                    this._updateTaskCount(task, 1);
                }
                if (task.state == scheduling) {
                    task._transitionTo(scheduled, scheduling);
                }
                return task;
            };
            Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
                return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
            };
            Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
                return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
            };
            Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
                return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
            };
            Zone.prototype.cancelTask = function (task) {
                if (task.zone != this)
                    throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                        (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
                task._transitionTo(canceling, scheduled, running);
                try {
                    this._zoneDelegate.cancelTask(this, task);
                }
                catch (err) {
                    task._transitionTo(unknown, canceling);
                    this._zoneDelegate.handleError(this, err);
                    throw err;
                }
                this._updateTaskCount(task, -1);
                task._transitionTo(notScheduled, canceling);
                task.runCount = 0;
                return task;
            };
            Zone.prototype._updateTaskCount = function (task, count) {
                var zoneDelegates = task._zoneDelegates;
                if (count == -1) {
                    task._zoneDelegates = null;
                }
                for (var i = 0; i < zoneDelegates.length; i++) {
                    zoneDelegates[i]._updateTaskCount(task.type, count);
                }
            };
            Zone.__symbol__ = __symbol__;
            return Zone;
        }());
        var DELEGATE_ZS = {
            name: '',
            onHasTask: function (delegate, _, target, hasTaskState) {
                return delegate.hasTask(target, hasTaskState);
            },
            onScheduleTask: function (delegate, _, target, task) {
                return delegate.scheduleTask(target, task);
            },
            onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) { return delegate.invokeTask(target, task, applyThis, applyArgs); },
            onCancelTask: function (delegate, _, target, task) {
                return delegate.cancelTask(target, task);
            }
        };
        var ZoneDelegate = (function () {
            function ZoneDelegate(zone, parentDelegate, zoneSpec) {
                this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
                this.zone = zone;
                this._parentDelegate = parentDelegate;
                this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
                this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
                this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
                this._interceptZS =
                    zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
                this._interceptDlgt =
                    zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
                this._interceptCurrZone =
                    zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
                this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
                this._invokeDlgt =
                    zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
                this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
                this._handleErrorZS =
                    zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
                this._handleErrorDlgt =
                    zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
                this._handleErrorCurrZone =
                    zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
                this._scheduleTaskZS =
                    zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
                this._scheduleTaskDlgt =
                    zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
                this._scheduleTaskCurrZone =
                    zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
                this._invokeTaskZS =
                    zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
                this._invokeTaskDlgt =
                    zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
                this._invokeTaskCurrZone =
                    zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
                this._cancelTaskZS =
                    zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
                this._cancelTaskDlgt =
                    zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
                this._cancelTaskCurrZone =
                    zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
                this._hasTaskZS = null;
                this._hasTaskDlgt = null;
                this._hasTaskDlgtOwner = null;
                this._hasTaskCurrZone = null;
                var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
                var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
                if (zoneSpecHasTask || parentHasTask) {
                    this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                    this._hasTaskDlgt = parentDelegate;
                    this._hasTaskDlgtOwner = this;
                    this._hasTaskCurrZone = zone;
                    if (!zoneSpec.onScheduleTask) {
                        this._scheduleTaskZS = DELEGATE_ZS;
                        this._scheduleTaskDlgt = parentDelegate;
                        this._scheduleTaskCurrZone = this.zone;
                    }
                    if (!zoneSpec.onInvokeTask) {
                        this._invokeTaskZS = DELEGATE_ZS;
                        this._invokeTaskDlgt = parentDelegate;
                        this._invokeTaskCurrZone = this.zone;
                    }
                    if (!zoneSpec.onCancelTask) {
                        this._cancelTaskZS = DELEGATE_ZS;
                        this._cancelTaskDlgt = parentDelegate;
                        this._cancelTaskCurrZone = this.zone;
                    }
                }
            }
            ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
                return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                    new Zone(targetZone, zoneSpec);
            };
            ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
                return this._interceptZS ?
                    this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                    callback;
            };
            ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
                return this._invokeZS ?
                    this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                    callback.apply(applyThis, applyArgs);
            };
            ZoneDelegate.prototype.handleError = function (targetZone, error) {
                return this._handleErrorZS ?
                    this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                    true;
            };
            ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
                var returnTask = task;
                if (this._scheduleTaskZS) {
                    if (this._hasTaskZS) {
                        returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                    }
                    returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                    if (!returnTask)
                        returnTask = task;
                }
                else {
                    if (task.scheduleFn) {
                        task.scheduleFn(task);
                    }
                    else if (task.type == microTask) {
                        scheduleMicroTask(task);
                    }
                    else {
                        throw new Error('Task is missing scheduleFn.');
                    }
                }
                return returnTask;
            };
            ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
                return this._invokeTaskZS ?
                    this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                    task.callback.apply(applyThis, applyArgs);
            };
            ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
                var value;
                if (this._cancelTaskZS) {
                    value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
                }
                else {
                    if (!task.cancelFn) {
                        throw Error('Task is not cancelable');
                    }
                    value = task.cancelFn(task);
                }
                return value;
            };
            ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
                try {
                    return this._hasTaskZS &&
                        this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
                }
                catch (err) {
                    this.handleError(targetZone, err);
                }
            };
            ZoneDelegate.prototype._updateTaskCount = function (type, count) {
                var counts = this._taskCounts;
                var prev = counts[type];
                var next = counts[type] = prev + count;
                if (next < 0) {
                    throw new Error('More tasks executed then were scheduled.');
                }
                if (prev == 0 || next == 0) {
                    var isEmpty = {
                        microTask: counts['microTask'] > 0,
                        macroTask: counts['macroTask'] > 0,
                        eventTask: counts['eventTask'] > 0,
                        change: type
                    };
                    this.hasTask(this.zone, isEmpty);
                }
            };
            return ZoneDelegate;
        }());
        var ZoneTask = (function () {
            function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
                this._zone = null;
                this.runCount = 0;
                this._zoneDelegates = null;
                this._state = 'notScheduled';
                this.type = type;
                this.source = source;
                this.data = options;
                this.scheduleFn = scheduleFn;
                this.cancelFn = cancelFn;
                this.callback = callback;
                var self = this;
                if (type === eventTask && options && options.useG) {
                    this.invoke = ZoneTask.invokeTask;
                }
                else {
                    this.invoke = function () {
                        return ZoneTask.invokeTask.call(global, self, this, arguments);
                    };
                }
            }
            ZoneTask.invokeTask = function (task, target, args) {
                if (!task) {
                    task = this;
                }
                _numberOfNestedTaskFrames++;
                try {
                    task.runCount++;
                    return task.zone.runTask(task, target, args);
                }
                finally {
                    if (_numberOfNestedTaskFrames == 1) {
                        drainMicroTaskQueue();
                    }
                    _numberOfNestedTaskFrames--;
                }
            };
            Object.defineProperty(ZoneTask.prototype, "zone", {
                get: function () {
                    return this._zone;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZoneTask.prototype, "state", {
                get: function () {
                    return this._state;
                },
                enumerable: true,
                configurable: true
            });
            ZoneTask.prototype.cancelScheduleRequest = function () {
                this._transitionTo(notScheduled, scheduling);
            };
            ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
                if (this._state === fromState1 || this._state === fromState2) {
                    this._state = toState;
                    if (toState == notScheduled) {
                        this._zoneDelegates = null;
                    }
                }
                else {
                    throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ?
                        ' or \'' + fromState2 + '\'' :
                        '') + ", was '" + this._state + "'.");
                }
            };
            ZoneTask.prototype.toString = function () {
                if (this.data && typeof this.data.handleId !== 'undefined') {
                    return this.data.handleId;
                }
                else {
                    return Object.prototype.toString.call(this);
                }
            };
            ZoneTask.prototype.toJSON = function () {
                return {
                    type: this.type,
                    state: this.state,
                    source: this.source,
                    zone: this.zone.name,
                    runCount: this.runCount
                };
            };
            return ZoneTask;
        }());
        var symbolSetTimeout = __symbol__('setTimeout');
        var symbolPromise = __symbol__('Promise');
        var symbolThen = __symbol__('then');
        var _microTaskQueue = [];
        var _isDrainingMicrotaskQueue = false;
        var nativeMicroTaskQueuePromise;
        function scheduleMicroTask(task) {
            if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
                if (!nativeMicroTaskQueuePromise) {
                    if (global[symbolPromise]) {
                        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                    }
                }
                if (nativeMicroTaskQueuePromise) {
                    nativeMicroTaskQueuePromise[symbolThen](drainMicroTaskQueue);
                }
                else {
                    global[symbolSetTimeout](drainMicroTaskQueue, 0);
                }
            }
            task && _microTaskQueue.push(task);
        }
        function drainMicroTaskQueue() {
            if (!_isDrainingMicrotaskQueue) {
                _isDrainingMicrotaskQueue = true;
                while (_microTaskQueue.length) {
                    var queue = _microTaskQueue;
                    _microTaskQueue = [];
                    for (var i = 0; i < queue.length; i++) {
                        var task = queue[i];
                        try {
                            task.zone.runTask(task, null, null);
                        }
                        catch (error) {
                            _api.onUnhandledError(error);
                        }
                    }
                }
                _api.microtaskDrainDone();
                _isDrainingMicrotaskQueue = false;
            }
        }
        Zone.drainMicroTaskQueue = drainMicroTaskQueue;
        var NO_ZONE = { name: 'NO ZONE' };
        var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
        var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
        var patches = {};
        var _api = {
            symbol: __symbol__,
            currentZoneFrame: function () { return _currentZoneFrame; },
            onUnhandledError: noop,
            microtaskDrainDone: noop,
            scheduleMicroTask: scheduleMicroTask,
            showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
            patchEventTarget: function () { return []; },
            patchOnProperties: noop,
            patchMethod: function () { return noop; },
            bindArguments: function () { return null; },
            setNativePromise: function (NativePromise) {
                if (NativePromise && typeof NativePromise.resolve === FUNCTION) {
                    nativeMicroTaskQueuePromise = NativePromise.resolve(0);
                }
            },
        };
        var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
        var _currentTask = null;
        var _numberOfNestedTaskFrames = 0;
        function noop() { }
        function __symbol__(name) {
            return '__zone_symbol__' + name;
        }
        performanceMeasure('Zone', 'Zone');
        return global['Zone'] = Zone;
    })(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);
    var __values = (undefined && undefined.__values) || function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };
    Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
        var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        var ObjectDefineProperty = Object.defineProperty;
        function readableObjectToString(obj) {
            if (obj && obj.toString === Object.prototype.toString) {
                var className = obj.constructor && obj.constructor.name;
                return (className ? className : '') + ': ' + JSON.stringify(obj);
            }
            return obj ? obj.toString() : Object.prototype.toString.call(obj);
        }
        var __symbol__ = api.symbol;
        var _uncaughtPromiseErrors = [];
        var symbolPromise = __symbol__('Promise');
        var symbolThen = __symbol__('then');
        var creationTrace = '__creationTrace__';
        api.onUnhandledError = function (e) {
            if (api.showUncaughtError()) {
                var rejection = e && e.rejection;
                if (rejection) {
                    console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
                }
                else {
                    console.error(e);
                }
            }
        };
        api.microtaskDrainDone = function () {
            while (_uncaughtPromiseErrors.length) {
                var _loop_1 = function () {
                    var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                    try {
                        uncaughtPromiseError.zone.runGuarded(function () {
                            throw uncaughtPromiseError;
                        });
                    }
                    catch (error) {
                        handleUnhandledRejection(error);
                    }
                };
                while (_uncaughtPromiseErrors.length) {
                    _loop_1();
                }
            }
        };
        var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
        function handleUnhandledRejection(e) {
            api.onUnhandledError(e);
            try {
                var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
                if (handler && typeof handler === 'function') {
                    handler.call(this, e);
                }
            }
            catch (err) {
            }
        }
        function isThenable(value) {
            return value && value.then;
        }
        function forwardResolution(value) {
            return value;
        }
        function forwardRejection(rejection) {
            return ZoneAwarePromise.reject(rejection);
        }
        var symbolState = __symbol__('state');
        var symbolValue = __symbol__('value');
        var symbolFinally = __symbol__('finally');
        var symbolParentPromiseValue = __symbol__('parentPromiseValue');
        var symbolParentPromiseState = __symbol__('parentPromiseState');
        var source = 'Promise.then';
        var UNRESOLVED = null;
        var RESOLVED = true;
        var REJECTED = false;
        var REJECTED_NO_CATCH = 0;
        function makeResolver(promise, state) {
            return function (v) {
                try {
                    resolvePromise(promise, state, v);
                }
                catch (err) {
                    resolvePromise(promise, false, err);
                }
            };
        }
        var once = function () {
            var wasCalled = false;
            return function wrapper(wrappedFunction) {
                return function () {
                    if (wasCalled) {
                        return;
                    }
                    wasCalled = true;
                    wrappedFunction.apply(null, arguments);
                };
            };
        };
        var TYPE_ERROR = 'Promise resolved with itself';
        var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
        function resolvePromise(promise, state, value) {
            var onceWrapper = once();
            if (promise === value) {
                throw new TypeError(TYPE_ERROR);
            }
            if (promise[symbolState] === UNRESOLVED) {
                var then = null;
                try {
                    if (typeof value === 'object' || typeof value === 'function') {
                        then = value && value.then;
                    }
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                    return promise;
                }
                if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                    value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                    value[symbolState] !== UNRESOLVED) {
                    clearRejectedNoCatch(value);
                    resolvePromise(promise, value[symbolState], value[symbolValue]);
                }
                else if (state !== REJECTED && typeof then === 'function') {
                    try {
                        then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                    }
                    catch (err) {
                        onceWrapper(function () {
                            resolvePromise(promise, false, err);
                        })();
                    }
                }
                else {
                    promise[symbolState] = state;
                    var queue = promise[symbolValue];
                    promise[symbolValue] = value;
                    if (promise[symbolFinally] === symbolFinally) {
                        if (state === RESOLVED) {
                            promise[symbolState] = promise[symbolParentPromiseState];
                            promise[symbolValue] = promise[symbolParentPromiseValue];
                        }
                    }
                    if (state === REJECTED && value instanceof Error) {
                        var trace = Zone.currentTask && Zone.currentTask.data &&
                            Zone.currentTask.data[creationTrace];
                        if (trace) {
                            ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                        }
                    }
                    for (var i = 0; i < queue.length;) {
                        scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                    }
                    if (queue.length == 0 && state == REJECTED) {
                        promise[symbolState] = REJECTED_NO_CATCH;
                        try {
                            throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                                (value && value.stack ? '\n' + value.stack : ''));
                        }
                        catch (err) {
                            var error_1 = err;
                            error_1.rejection = value;
                            error_1.promise = promise;
                            error_1.zone = Zone.current;
                            error_1.task = Zone.currentTask;
                            _uncaughtPromiseErrors.push(error_1);
                            api.scheduleMicroTask();
                        }
                    }
                }
            }
            return promise;
        }
        var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
        function clearRejectedNoCatch(promise) {
            if (promise[symbolState] === REJECTED_NO_CATCH) {
                try {
                    var handler = Zone[REJECTION_HANDLED_HANDLER];
                    if (handler && typeof handler === 'function') {
                        handler.call(this, { rejection: promise[symbolValue], promise: promise });
                    }
                }
                catch (err) {
                }
                promise[symbolState] = REJECTED;
                for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                    if (promise === _uncaughtPromiseErrors[i].promise) {
                        _uncaughtPromiseErrors.splice(i, 1);
                    }
                }
            }
        }
        function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
            clearRejectedNoCatch(promise);
            var promiseState = promise[symbolState];
            var delegate = promiseState ?
                (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
                (typeof onRejected === 'function') ? onRejected : forwardRejection;
            zone.scheduleMicroTask(source, function () {
                try {
                    var parentPromiseValue = promise[symbolValue];
                    var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                    if (isFinallyPromise) {
                        chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                        chainPromise[symbolParentPromiseState] = promiseState;
                    }
                    var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
                    resolvePromise(chainPromise, true, value);
                }
                catch (error) {
                    resolvePromise(chainPromise, false, error);
                }
            }, chainPromise);
        }
        var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
        var ZoneAwarePromise = (function () {
            function ZoneAwarePromise(executor) {
                var promise = this;
                if (!(promise instanceof ZoneAwarePromise)) {
                    throw new Error('Must be an instanceof Promise.');
                }
                promise[symbolState] = UNRESOLVED;
                promise[symbolValue] = [];
                try {
                    executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
                }
                catch (error) {
                    resolvePromise(promise, false, error);
                }
            }
            ZoneAwarePromise.toString = function () {
                return ZONE_AWARE_PROMISE_TO_STRING;
            };
            ZoneAwarePromise.resolve = function (value) {
                return resolvePromise(new this(null), RESOLVED, value);
            };
            ZoneAwarePromise.reject = function (error) {
                return resolvePromise(new this(null), REJECTED, error);
            };
            ZoneAwarePromise.race = function (values) {
                var resolve;
                var reject;
                var promise = new this(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                function onResolve(value) {
                    promise && (promise = null || resolve(value));
                }
                function onReject(error) {
                    promise && (promise = null || reject(error));
                }
                try {
                    for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                        var value = values_1_1.value;
                        if (!isThenable(value)) {
                            value = this.resolve(value);
                        }
                        value.then(onResolve, onReject);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (values_1_1 && !values_1_1.done && (_a = values_1.return))
                            _a.call(values_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                return promise;
                var e_1, _a;
            };
            ZoneAwarePromise.all = function (values) {
                var resolve;
                var reject;
                var promise = new this(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                var count = 0;
                var resolvedValues = [];
                try {
                    for (var values_2 = __values(values), values_2_1 = values_2.next(); !values_2_1.done; values_2_1 = values_2.next()) {
                        var value = values_2_1.value;
                        if (!isThenable(value)) {
                            value = this.resolve(value);
                        }
                        value.then((function (index) {
                            return function (value) {
                                resolvedValues[index] = value;
                                count--;
                                if (!count) {
                                    resolve(resolvedValues);
                                }
                            };
                        })(count), reject);
                        count++;
                    }
                }
                catch (e_2_1) {
                    e_2 = { error: e_2_1 };
                }
                finally {
                    try {
                        if (values_2_1 && !values_2_1.done && (_a = values_2.return))
                            _a.call(values_2);
                    }
                    finally {
                        if (e_2)
                            throw e_2.error;
                    }
                }
                if (!count)
                    resolve(resolvedValues);
                return promise;
                var e_2, _a;
            };
            ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
                var chainPromise = new this.constructor(null);
                var zone = Zone.current;
                if (this[symbolState] == UNRESOLVED) {
                    this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
                }
                else {
                    scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
                }
                return chainPromise;
            };
            ZoneAwarePromise.prototype.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            ZoneAwarePromise.prototype.finally = function (onFinally) {
                var chainPromise = new this.constructor(null);
                chainPromise[symbolFinally] = symbolFinally;
                var zone = Zone.current;
                if (this[symbolState] == UNRESOLVED) {
                    this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
                }
                else {
                    scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
                }
                return chainPromise;
            };
            return ZoneAwarePromise;
        }());
        ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
        ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
        ZoneAwarePromise['race'] = ZoneAwarePromise.race;
        ZoneAwarePromise['all'] = ZoneAwarePromise.all;
        var NativePromise = global[symbolPromise] = global['Promise'];
        var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
        global['Promise'] = ZoneAwarePromise;
        var symbolThenPatched = __symbol__('thenPatched');
        function patchThen(Ctor) {
            var proto = Ctor.prototype;
            var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
            if (prop && (prop.writable === false || !prop.configurable)) {
                return;
            }
            var originalThen = proto.then;
            proto[symbolThen] = originalThen;
            Ctor.prototype.then = function (onResolve, onReject) {
                var _this = this;
                var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                    originalThen.call(_this, resolve, reject);
                });
                return wrapped.then(onResolve, onReject);
            };
            Ctor[symbolThenPatched] = true;
        }
        function zoneify(fn) {
            return function () {
                var resultPromise = fn.apply(this, arguments);
                if (resultPromise instanceof ZoneAwarePromise) {
                    return resultPromise;
                }
                var ctor = resultPromise.constructor;
                if (!ctor[symbolThenPatched]) {
                    patchThen(ctor);
                }
                return resultPromise;
            };
        }
        if (NativePromise) {
            patchThen(NativePromise);
            var fetch_1 = global['fetch'];
            if (typeof fetch_1 == 'function') {
                global['fetch'] = zoneify(fetch_1);
            }
        }
        Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
        return ZoneAwarePromise;
    });
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectGetPrototypeOf = Object.getPrototypeOf;
    var ADD_EVENT_LISTENER_STR = 'addEventListener';
    var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
    var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
    var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
    function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
        return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
    }
    var zoneSymbol = Zone.__symbol__;
    var isWindowExists = typeof window !== 'undefined';
    var internalWindow = isWindowExists ? window : undefined;
    var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
    function isPropertyWritable(propertyDesc) {
        if (!propertyDesc) {
            return true;
        }
        if (propertyDesc.writable === false) {
            return false;
        }
        return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
    }
    var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
    var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
        {}.toString.call(_global.process) === '[object process]');
    var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
    var isMix = typeof _global.process !== 'undefined' &&
        {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
        !!(isWindowExists && internalWindow['HTMLElement']);
    var originalInstanceKey = zoneSymbol('originalInstance');
    function patchMethod(target, name, patchFn) {
        var proto = target;
        while (proto && !proto.hasOwnProperty(name)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && target[name]) {
            proto = target;
        }
        var delegateName = zoneSymbol(name);
        var delegate;
        if (proto && !(delegate = proto[delegateName])) {
            delegate = proto[delegateName] = proto[name];
            var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
            if (isPropertyWritable(desc)) {
                var patchDelegate_1 = patchFn(delegate, delegateName, name);
                proto[name] = function () {
                    return patchDelegate_1(this, arguments);
                };
                attachOriginToPatched(proto[name], delegate);
            }
        }
        return delegate;
    }
    function attachOriginToPatched(patched, original) {
        patched[zoneSymbol('OriginalDelegate')] = original;
    }
    Zone.__load_patch('toString', function (global) {
        var originalFunctionToString = Function.prototype.toString;
        var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
        var PROMISE_SYMBOL = zoneSymbol('Promise');
        var ERROR_SYMBOL = zoneSymbol('Error');
        var newFunctionToString = function toString() {
            if (typeof this === 'function') {
                var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
                if (originalDelegate) {
                    if (typeof originalDelegate === 'function') {
                        return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                    }
                    else {
                        return Object.prototype.toString.call(originalDelegate);
                    }
                }
                if (this === Promise) {
                    var nativePromise = global[PROMISE_SYMBOL];
                    if (nativePromise) {
                        return originalFunctionToString.apply(nativePromise, arguments);
                    }
                }
                if (this === Error) {
                    var nativeError = global[ERROR_SYMBOL];
                    if (nativeError) {
                        return originalFunctionToString.apply(nativeError, arguments);
                    }
                }
            }
            return originalFunctionToString.apply(this, arguments);
        };
        newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
        Function.prototype.toString = newFunctionToString;
        var originalObjectToString = Object.prototype.toString;
        var PROMISE_OBJECT_TO_STRING = '[object Promise]';
        Object.prototype.toString = function () {
            if (this instanceof Promise) {
                return PROMISE_OBJECT_TO_STRING;
            }
            return originalObjectToString.apply(this, arguments);
        };
    });
    Zone.__load_patch('Error', function (global, Zone, api) {
        var blacklistedStackFramesSymbol = api.symbol('blacklistedStackFrames');
        var NativeError = global[api.symbol('Error')] = global['Error'];
        var blackListedStackFrames = {};
        var zoneAwareFrame1;
        var zoneAwareFrame2;
        global['Error'] = ZoneAwareError;
        var stackRewrite = 'stackRewrite';
        function ZoneAwareError() {
            var _this = this;
            var error = NativeError.apply(this, arguments);
            var originalStack = error['originalStack'] = error.stack;
            if (ZoneAwareError[stackRewrite] && originalStack) {
                var frames_1 = originalStack.split('\n');
                var zoneFrame = api.currentZoneFrame();
                var i = 0;
                while (!(frames_1[i] === zoneAwareFrame1 || frames_1[i] === zoneAwareFrame2) &&
                    i < frames_1.length) {
                    i++;
                }
                for (; i < frames_1.length && zoneFrame; i++) {
                    var frame = frames_1[i];
                    if (frame.trim()) {
                        switch (blackListedStackFrames[frame]) {
                            case 0:
                                frames_1.splice(i, 1);
                                i--;
                                break;
                            case 1:
                                if (zoneFrame.parent) {
                                    zoneFrame = zoneFrame.parent;
                                }
                                else {
                                    zoneFrame = null;
                                }
                                frames_1.splice(i, 1);
                                i--;
                                break;
                            default:
                                frames_1[i] += " [" + zoneFrame.zone.name + "]";
                        }
                    }
                }
                try {
                    error.stack = error.zoneAwareStack = frames_1.join('\n');
                }
                catch (e) {
                }
            }
            if (this instanceof NativeError && this.constructor != NativeError) {
                Object.keys(error).concat('stack', 'message').forEach(function (key) {
                    var value = error[key];
                    if (value !== undefined) {
                        try {
                            _this[key] = value;
                        }
                        catch (e) {
                        }
                    }
                });
                return this;
            }
            return error;
        }
        ZoneAwareError.prototype = NativeError.prototype;
        ZoneAwareError[blacklistedStackFramesSymbol] = blackListedStackFrames;
        ZoneAwareError[stackRewrite] = false;
        var specialPropertyNames = ['stackTraceLimit', 'captureStackTrace', 'prepareStackTrace'];
        var nativeErrorProperties = Object.keys(NativeError);
        if (nativeErrorProperties) {
            nativeErrorProperties.forEach(function (prop) {
                if (specialPropertyNames.filter(function (sp) { return sp === prop; }).length === 0) {
                    Object.defineProperty(ZoneAwareError, prop, {
                        get: function () {
                            return NativeError[prop];
                        },
                        set: function (value) {
                            NativeError[prop] = value;
                        }
                    });
                }
            });
        }
        if (NativeError.hasOwnProperty('stackTraceLimit')) {
            NativeError.stackTraceLimit = Math.max(NativeError.stackTraceLimit, 15);
            Object.defineProperty(ZoneAwareError, 'stackTraceLimit', {
                get: function () {
                    return NativeError.stackTraceLimit;
                },
                set: function (value) {
                    return NativeError.stackTraceLimit = value;
                }
            });
        }
        if (NativeError.hasOwnProperty('captureStackTrace')) {
            Object.defineProperty(ZoneAwareError, 'captureStackTrace', {
                value: function zoneCaptureStackTrace(targetObject, constructorOpt) {
                    NativeError.captureStackTrace(targetObject, constructorOpt);
                }
            });
        }
        var ZONE_CAPTURESTACKTRACE = 'zoneCaptureStackTrace';
        Object.defineProperty(ZoneAwareError, 'prepareStackTrace', {
            get: function () {
                return NativeError.prepareStackTrace;
            },
            set: function (value) {
                if (!value || typeof value !== 'function') {
                    return NativeError.prepareStackTrace = value;
                }
                return NativeError.prepareStackTrace = function (error, structuredStackTrace) {
                    if (structuredStackTrace) {
                        for (var i = 0; i < structuredStackTrace.length; i++) {
                            var st = structuredStackTrace[i];
                            if (st.getFunctionName() === ZONE_CAPTURESTACKTRACE) {
                                structuredStackTrace.splice(i, 1);
                                break;
                            }
                        }
                    }
                    return value.call(this, error, structuredStackTrace);
                };
            }
        });
        var ZONE_AWARE_ERROR = 'ZoneAwareError';
        var ERROR_DOT = 'Error.';
        var EMPTY = '';
        var RUN_GUARDED = 'runGuarded';
        var RUN_TASK = 'runTask';
        var RUN = 'run';
        var BRACKETS = '(';
        var AT = '@';
        var detectZone = Zone.current.fork({
            name: 'detect',
            onHandleError: function (parentZD, current, target, error) {
                if (error.originalStack && Error === ZoneAwareError) {
                    var frames_2 = error.originalStack.split(/\n/);
                    var runFrame = false, runGuardedFrame = false, runTaskFrame = false;
                    while (frames_2.length) {
                        var frame = frames_2.shift();
                        if (/:\d+:\d+/.test(frame)) {
                            var fnName = frame.split(BRACKETS)[0].split(AT)[0];
                            var frameType = 1;
                            if (fnName.indexOf(ZONE_AWARE_ERROR) !== -1) {
                                zoneAwareFrame1 = frame;
                                zoneAwareFrame2 = frame.replace(ERROR_DOT, EMPTY);
                                blackListedStackFrames[zoneAwareFrame2] = 0;
                            }
                            if (fnName.indexOf(RUN_GUARDED) !== -1) {
                                runGuardedFrame = true;
                            }
                            else if (fnName.indexOf(RUN_TASK) !== -1) {
                                runTaskFrame = true;
                            }
                            else if (fnName.indexOf(RUN) !== -1) {
                                runFrame = true;
                            }
                            else {
                                frameType = 0;
                            }
                            blackListedStackFrames[frame] = frameType;
                            if (runFrame && runGuardedFrame && runTaskFrame) {
                                ZoneAwareError[stackRewrite] = true;
                                break;
                            }
                        }
                    }
                }
                return false;
            }
        });
        var childDetectZone = detectZone.fork({
            name: 'child',
            onScheduleTask: function (delegate, curr, target, task) {
                return delegate.scheduleTask(target, task);
            },
            onInvokeTask: function (delegate, curr, target, task, applyThis, applyArgs) {
                return delegate.invokeTask(target, task, applyThis, applyArgs);
            },
            onCancelTask: function (delegate, curr, target, task) {
                return delegate.cancelTask(target, task);
            },
            onInvoke: function (delegate, curr, target, callback, applyThis, applyArgs, source) {
                return delegate.invoke(target, callback, applyThis, applyArgs, source);
            }
        });
        var originalStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = 100;
        childDetectZone.run(function () {
            childDetectZone.runGuarded(function () {
                var fakeTransitionTo = function () { };
                childDetectZone.scheduleEventTask(blacklistedStackFramesSymbol, function () {
                    childDetectZone.scheduleMacroTask(blacklistedStackFramesSymbol, function () {
                        childDetectZone.scheduleMicroTask(blacklistedStackFramesSymbol, function () {
                            throw ZoneAwareError.call(this, ZoneAwareError, NativeError);
                        }, null, function (t) {
                            t._transitionTo = fakeTransitionTo;
                            t.invoke();
                        });
                    }, null, function (t) {
                        t._transitionTo = fakeTransitionTo;
                        t.invoke();
                    }, function () { });
                }, null, function (t) {
                    t._transitionTo = fakeTransitionTo;
                    t.invoke();
                }, function () { });
            });
        });
        Error.stackTraceLimit = originalStackTraceLimit;
    });
    var taskSymbol = zoneSymbol('zoneTask');
    function patchTimer(window, setName, cancelName, nameSuffix) {
        var setNative = null;
        var clearNative = null;
        setName += nameSuffix;
        cancelName += nameSuffix;
        var tasksByHandleId = {};
        function scheduleTask(task) {
            var data = task.data;
            function timer() {
                try {
                    task.invoke.apply(this, arguments);
                }
                finally {
                    if (!(task.data && task.data.isPeriodic)) {
                        if (typeof data.handleId === 'number') {
                            delete tasksByHandleId[data.handleId];
                        }
                        else if (data.handleId) {
                            data.handleId[taskSymbol] = null;
                        }
                    }
                }
            }
            data.args[0] = timer;
            data.handleId = setNative.apply(window, data.args);
            return task;
        }
        function clearTask(task) {
            return clearNative(task.data.handleId);
        }
        setNative =
            patchMethod(window, setName, function (delegate) {
                return function (self, args) {
                    if (typeof args[0] === 'function') {
                        var options = {
                            handleId: null,
                            isPeriodic: nameSuffix === 'Interval',
                            delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 : null,
                            args: args
                        };
                        var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                        if (!task) {
                            return task;
                        }
                        var handle = task.data.handleId;
                        if (typeof handle === 'number') {
                            tasksByHandleId[handle] = task;
                        }
                        else if (handle) {
                            handle[taskSymbol] = task;
                        }
                        if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                            typeof handle.unref === 'function') {
                            task.ref = handle.ref.bind(handle);
                            task.unref = handle.unref.bind(handle);
                        }
                        if (typeof handle === 'number' || handle) {
                            return handle;
                        }
                        return task;
                    }
                    else {
                        return delegate.apply(window, args);
                    }
                };
            });
        clearNative =
            patchMethod(window, cancelName, function (delegate) {
                return function (self, args) {
                    var id = args[0];
                    var task;
                    if (typeof id === 'number') {
                        task = tasksByHandleId[id];
                    }
                    else {
                        task = id && id[taskSymbol];
                        if (!task) {
                            task = id;
                        }
                    }
                    if (task && typeof task.type === 'string') {
                        if (task.state !== 'notScheduled' &&
                            (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                            if (typeof id === 'number') {
                                delete tasksByHandleId[id];
                            }
                            else if (id) {
                                id[taskSymbol] = null;
                            }
                            task.zone.cancelTask(task);
                        }
                    }
                    else {
                        delegate.apply(window, args);
                    }
                };
            });
    }
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
})));
//# sourceMappingURL=zone-nativescript.js.map