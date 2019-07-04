import { createStateSequence } from "../createStateSequence";
import { PushDownAutomata } from "../PushDownAutomata";
import { PushState } from "../PushState";
import { StateResult } from "../StateResult";

describe("Woodcutter example program", () => {
  interface Person {
    location: string;
    wood: number;
  }

  // states
  const goto = (location: string) => {
    return {
      exec: (stack: PushState, person: Person) => {
        console.log("go to", location);
        person.location = location;
        return StateResult.PopStateReturn;
      },
    };
  };

  const chopTree = {
    exec: (stack: PushState, person: Person) => {
      console.log("chopping a tree");
      person.wood = 10;
      return StateResult.PopStateReturn;
    },
  };

  const collectWood = createStateSequence(
    goto("forest"),
    chopTree,
    goto("home"),
  );

  const getWood = (wood: number) => {
    return {
      exec: (stack: PushState, person: Person) => {
        console.log("get", wood, "wood");
        if (person.wood < wood) {
          stack.pushState(collectWood);
          return StateResult.KeepStateRunNext;
        }
        return StateResult.PopStateRunNext;
      },
    };
  };

  it("runs", () => {
    const pda = new PushDownAutomata();
    const woodcutter: Person = { location: "home", wood: 0 };
    pda.pushState(getWood(10));

    // go to forest
    pda.exec(woodcutter);
    console.log("at", woodcutter.location);
    expect(woodcutter.location).toBe("forest");

    // cut wood
    pda.exec(woodcutter);
    console.log("at", woodcutter.location);
    expect(woodcutter.location).toBe("forest");

    // go home
    pda.exec(woodcutter);
    expect(woodcutter.location).toBe("home");

    // finish
    pda.exec(woodcutter);
    expect(pda.empty).toBe(true);
    expect(woodcutter.wood);
  });
});
