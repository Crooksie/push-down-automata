import { StateResult } from "./StateResult";
import { PushState } from "./PushState";

export interface State {
    exec(stack: PushState): StateResult;
}