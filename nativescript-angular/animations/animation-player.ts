import { AnimationPlayer } from "@angular/animations";
import { KeyframeAnimation }
    from "tns-core-modules/ui/animation/keyframe-animation";

import { NgView } from "../element-registry";
import { Keyframe, createKeyframeAnimation } from "./utils";

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

    get totalTime(): number { return this.delay + this.duration; }

    init(): void {
    }

    hasStarted(): boolean {
        return this._started;
    }

    onStart(fn: Function): void { this._startSubscriptions.push(fn); }
    onDone(fn: Function): void { this._doneSubscriptions.push(fn); }
    onDestroy(fn: Function): void { this._doneSubscriptions.push(fn); }

    play(): void {
        if (!this.animation) {
            return;
        }

        if (!this._started) {
            this._started = true;
            this._startSubscriptions.forEach(fn => fn());
            this._startSubscriptions = [];
        }

        this.animation.play(this.target)
            .then(() => this.onFinish())
            .catch((_e) => { });
    }

    pause(): void {
        throw new Error("AnimationPlayer.pause method is not supported!");
    }

    finish(): void {
        throw new Error("AnimationPlayer.finish method is not supported!");
    }

    reset(): void {
        if (this.animation && this.animation.isPlaying) {
            this.animation.cancel();
        }
    }

    restart(): void {
        this.reset();
        this.play();
    }

    destroy(): void {
        this.reset();
        this.onFinish();
    }

    setPosition(_p: any): void {
        throw new Error("AnimationPlayer.setPosition method is not supported!");
    }

    getPosition(): number {
        return 0;
    }

    private initKeyframeAnimation(keyframes: Keyframe[], duration: number, delay: number, easing: string) {
        this.animation = createKeyframeAnimation(keyframes, duration, delay, easing);
    }

    private onFinish() {
        if (!this._finished) {
            this._finished = true;
            this._started = false;
            this._doneSubscriptions.forEach(fn => fn());
            this._doneSubscriptions = [];
        }
    }
}
