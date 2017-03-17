import { AnimationPlayer } from "@angular/animations";
import {
    KeyframeAnimation,
    KeyframeAnimationInfo,
} from "tns-core-modules/ui/animation/keyframe-animation";

import { NgView } from "../element-registry";
import { Keyframe, getAnimationCurve, parseAnimationKeyframe } from "./utils";

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
        duration: number,
        delay: number,
        easing: string
    ) {
        this.initKeyframeAnimation(keyframes, duration, delay, easing);
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
        let info = new KeyframeAnimationInfo();
        info.isForwards = true;
        info.iterations = 1;
        info.duration = duration === 0 ? 0.01 : duration;
        info.delay = delay;
        info.curve = getAnimationCurve(easing);
        info.keyframes = keyframes.map(parseAnimationKeyframe);

        this.animation = KeyframeAnimation.keyframeAnimationFromInfo(info);
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
