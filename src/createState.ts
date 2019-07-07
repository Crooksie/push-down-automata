import { PushState } from "./PushState";
import { State } from "./State";
import { StateResult } from "./StateResult";

export function createState(
  exec: (stack: PushState, ...args: any[]) => StateResult,
): State {
  return {
    exec,
  };
}
