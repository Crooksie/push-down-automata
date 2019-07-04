import { PushState } from "./PushState";
import { State } from "./State";
import { StateResult } from "./StateResult";

export function createStateSequence(...states: State[]) {
  return {
    exec: (stack: PushState, ...args: any[]) => {
      for (const state of states) {
        stack.pushState(state);
      }
      return StateResult.PopStateRunNext;
    },
  };
}
