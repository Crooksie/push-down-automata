import { PushState } from "./PushState";
import { State } from "./State";
import { StateResult } from "./StateResult";

export class PushDownAutomata implements PushState {
  public pushState(state: State): void {
    this.stack.push(state);
  }

  public pushStack(states: State[]) {
    for (const state of states.reverse()) {
      this.stack.push(state);
    }
  }

  public exec(...args: any[]) {
    while (true) {
      const newStack: State[] = [];
      const currentState = this.stack.pop();

      if (currentState === undefined) {
        return;
      }

      const currentStateResult = currentState.exec(
        { pushState: (state: State) => newStack.push(state) },
        ...args,
      );

      switch (currentStateResult) {
        case StateResult.KeepStateReturn:
          this.pushState(currentState);
          this.pushStack(newStack);
          return;

        case StateResult.PopStateReturn:
          this.pushStack(newStack);
          return;

        case StateResult.PopStateRunNext:
          this.pushStack(newStack);
          continue;

        case StateResult.KeepStateRunNext:
          this.pushState(currentState);
          this.pushStack(newStack);
          continue;
      }
    }
  }

  public get empty() {
    return this.stack.length === 0;
  }

  private stack: State[] = [];
}
