import { PushState } from "./PushState";
import { StateResult } from "./StateResult";

export interface State {
  exec(stack: PushState, ...args: any[]): StateResult;
}
