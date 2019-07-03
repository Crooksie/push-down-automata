import { PushDownAutomata } from "../PushDownAutomata";
import { PushState } from "../PushState";
import { StateResult } from "../StateResult";
import { createStateSequence } from "../createStateSequence";

describe("Woodcutter example program", () => {
    type Person = { location: string };

    // states
    const goto = (location: string) => {
        return {
            exec: (stack: PushState, person: Person) => {
                person.location = location;
                return StateResult.PopStateReturn;
            }
        };
    };

    const chopWood = {
        exec: (stack: PushState, person: Person) => {
            return StateResult.PopStateReturn;
        }
    };

    const collectWood = createStateSequence(goto("forest"), chopWood, goto("home"));

    it("runs", () => {
        const pda = new PushDownAutomata();
        let woodcutter = { location: "home" };
        pda.pushState(collectWood);

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

        // finished
        expect(pda.empty).toBe(true);
    });
});