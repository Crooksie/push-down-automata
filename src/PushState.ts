import { State } from "./State";

export interface PushState {
    pushState(state: State): void;
}
