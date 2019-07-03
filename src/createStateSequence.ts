import { State } from "./State";
import { PushState } from "./PushState";
import { StateResult } from "./StateResult";

export function createStateSequence(...states: State[]) {
    return {
        exec: (stack: PushState, ...args: any[]) => {
            for (const state of states.reverse()) {
                stack.pushState(state);
            }
            return StateResult.PopStateRunNext;
        }
    };
}