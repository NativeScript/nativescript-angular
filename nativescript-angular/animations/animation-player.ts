import { AnimationPlayer } from "@angular/animations";
import { KeyframeAnimation }
    from "@nativescript/core/ui/animation/keyframe-animation";
import { View, EventData } from "@nativescript/core/ui/core/view";

import { Keyframe, createKeyframeAnimation } from "./utils";
import { NgView } from "../element-registry";
import { animationsLog as traceLog, isLogEnabled } from "../trace";

export class NativeScriptAnimationPlayer implements AnimationPlayer {
    public parentPlayer: AnimationPlayer = null;

    private _startSubscriptions: Function[] = [];
    private _doneSubscriptions: Function[] = [];
    private _finished = false;
    private _started = false;
    private animation: KeyframeAnimation;

    constructor(
        private target: NgView,
        keyframes: Keyframe[],
        private duration: number,
        private delay: number,
        easing: string
    ) {
        this.initKeyframeAnimation(keyframes, duration, delay, easing);
    }

    get totalTime(): number {
        return this.delay + this.duration;
    }

    init(): void {
    }

    hasStarted(): boolean {
        return this._started;
    }

    onStart(fn: Function): void { this._startSubscriptions.push(fn); }
    onDone(fn: Function): void { this._doneSubscriptions.push(fn); }
    onDestroy(fn: Function): void { this._doneSubscriptions.push(fn); }

    play(): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptAnimationPlayer.play`);
        }

        if (!this.animation) {
            return;
        }

        if (!this._started) {
            this._started = true;
            this._startSubscriptions.forEach(fn => fn());
            this._startSubscriptions = [];
        }

        // When this issue https://github.com/NativeScript/NativeScript/issues/7984 is fixes in @nativescript/core
        // we can change this fix and apply the one that is recommended in that issue.
        if (this.target.isLoaded) {
            this.playAnimation();
        } else {
            this.target.on(View.loadedEvent, this.onTargetLoaded.bind(this));
        }
    }

    private onTargetLoaded(args: EventData) {
        this.target.off(View.loadedEvent, this.onTargetLoaded);
        this.playAnimation();
    }

    private playAnimation() {
        this.animation.play(this.target)
            .then(() => this.onFinish())
            .catch((_e) => {});
    }

    pause(): void {
    }

    finish(): void {
        this.onFinish();
    }

    reset(): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptAnimationPlayer.reset`);
        }

        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
    }

    restart(): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptAnimationPlayer.restart`);
        }

        this.reset();
        this.play();
    }

    destroy(): void {
        if (isLogEnabled()) {
            traceLog(`NativeScriptAnimationPlayer.destroy`);
        }
        this.onFinish();
    }

    setPosition(_p: any): void {
        throw new Error("AnimationPlayer.setPosition method is not supported!");
    }

    getPosition(): number {
        return 0;
    }

    private initKeyframeAnimation(keyframes: Keyframe[], duration: number, delay: number, easing: string) {
        if (isLogEnabled()) {
            traceLog(`NativeScriptAnimationPlayer.initKeyframeAnimation`);
        }

        this.animation = createKeyframeAnimation(keyframes, duration, delay, easing);
    }

    private onFinish() {
        if (isLogEnabled()) {
            traceLog(`NativeScriptAnimationPlayer.onFinish`);
        }

        if (this._finished) {
            return;
        }

        this._finished = true;
        this._started = false;
        this._doneSubscriptions.forEach(fn => fn());
        this._doneSubscriptions = [];
    }
}
