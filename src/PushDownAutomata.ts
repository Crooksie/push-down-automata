import { PushState } from "./PushState";
import { State } from "./State";
import { StateResult } from "./StateResult";

export class PushDownAutomata implements PushState {
  public pushState(state: State): void {
    this.stack.push(state);
  }

  public exec(...args: any[]) {
    while (true) {
      const currentState = this.stack.pop();
      if (currentState === undefined) {
        return;
      }
      const currentStateResult = currentState.exec(this, ...args);
      switch (currentStateResult) {
        case StateResult.KeepStateReturn:
          this.stack.push(currentState);
          return;
        case StateResult.PopStateReturn:
          return;
        case StateResult.PopStateRunNext:
          continue;
      }
    }
  }

  public get empty() {
    return this.stack.length === 0;
  }

  private stack: State[] = [];
}
