import { PushDownAutomata } from "./PushDownAutomata";
import { State } from "./State";
import { StateResult } from "./StateResult";
import { PushState } from "./PushState";

describe("PushDownAutomata", () => {
    it("handles an empty stack", () => {
        const pda = new PushDownAutomata();
        expect(pda.empty).toBe(true);

        pda.exec();
        expect(pda.empty).toBe(true);
    });

    it("handles a single returning state", () => {
        const pda = new PushDownAutomata();
        const mockState: State = { exec: jest.fn(() => StateResult.PopStateReturn)};
        expect(pda.empty).toBe(true);

        pda.pushState(mockState);
        expect(pda.empty).toBe(false);

        pda.exec();

        expect(mockState.exec).toBeCalled();
        expect(pda.empty).toBe(true);
    });

    it("handles a continuing state", () => {
        const pda = new PushDownAutomata();
        const mockState: State = { exec: jest.fn(() => StateResult.KeepStateReturn)};
        expect(pda.empty).toBe(true);

        pda.pushState(mockState);
        expect(pda.empty).toBe(false);

        pda.exec();

        expect(mockState.exec).toBeCalled();
        expect(pda.empty).toBe(false);
    });

    it("handles a continuing state", () => {
        const pda = new PushDownAutomata();
        const returningState: State = { exec: jest.fn(() => StateResult.PopStateReturn)};
        const continuingState: State = { exec: jest.fn((stack: PushState) => {
            stack.pushState(returningState);
            return StateResult.PopStateRunNext;
        })};

        expect(pda.empty).toBe(true);

        pda.pushState(continuingState);
        expect(pda.empty).toBe(false);

        pda.exec();

        expect(continuingState.exec).toBeCalled();
        expect(returningState.exec).toBeCalled();
        expect(pda.empty).toBe(true);
    });

    it("passes through its args", () => {
        const pda = new PushDownAutomata();

        const initialA = 10;
        const initalB = "foo";
        const initialC = "Trev";
        
        const expectedB = "bar";
        const expectedC = "Kev";

        const exec = jest.fn((stack: PushState, a: { a: number } , d: {b: string, c: string}) => {
            expect(a).toBe(initialA);
            d.b = expectedB;
            d.c = expectedC;
            return StateResult.KeepStateReturn;
        });

        const mockState: State = { exec };
        const d = { b: initalB, c: initialC }

        pda.pushState(mockState);
        pda.exec(initialA, d)

        expect(exec).toBeCalled();
        expect(d.b).toBe(expectedB);
        expect(d.c).toBe(expectedC);
    });
});