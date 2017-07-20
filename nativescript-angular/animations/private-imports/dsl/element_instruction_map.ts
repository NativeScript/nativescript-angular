/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/* tslint:disable */
import {AnimationTimelineInstruction} from '@angular/animations/browser/src/dsl/animation_timeline_instruction';

export class ElementInstructionMap {
  private _map = new Map<any, AnimationTimelineInstruction[]>();

  consume(element: any): AnimationTimelineInstruction[] {
    let instructions = this._map.get(element);
    if (instructions) {
      this._map.delete(element);
    } else {
      instructions = [];
    }
    return instructions;
  }

  append(element: any, instructions: AnimationTimelineInstruction[]) {
    let existingInstructions = this._map.get(element);
    if (!existingInstructions) {
      this._map.set(element, existingInstructions = []);
    }
    existingInstructions.push(...instructions);
  }

  has(element: any): boolean { return this._map.has(element); }

  clear() { this._map.clear(); }
}