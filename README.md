# Pushdown Automata (PDA)

A generic, stack-based pushdown automata implementation in TypeScript, originally developed for the game [Screeps](https://screeps.com/).

## What is a Pushdown Automata?

A Pushdown Automata (PDA) is a type of computational model that extends the capabilities of a Finite State Machine (FSM) by adding a stack. 

While a standard FSM can only be in one state at a time and transitions between them, a PDA can "push" states onto a stack and "pop" them off. This allows for more complex, hierarchical behaviors and memory. For example, a PDA can easily handle nested tasks: "Go to the forest, but if you're hungry, push the 'Find Food' state, and once that's done, pop back to 'Go to the forest'."

## Design Decisions

This implementation was designed with flexibility and the constraints of Screeps in mind:

- **Generic Arguments**: The `exec` method of the automata accepts spread arguments (`...args: any[]`), allowing you to pass any context (like game objects, memory, or global state) to your states without tight coupling.
- **Control Flow via Enum**: Instead of states manually manipulating the stack in complex ways, they return a `StateResult`. This enum clearly defines whether the current state should be kept or removed from the stack, and whether the automata should stop for the current tick or immediately execute the next state.
- **Composable States**: Helpers like `createStateSequence` allow you to group simple states into complex behaviors without creating new class definitions for every sequence.
- **Stateless Execution**: The automata itself manages the stack, but individual states can be implemented as simple functions or objects, making them easy to test and reuse.

## Installation

```bash
npm install push-down-automata
```

## Usage

### Defining States

States are objects that implement the `State` interface. You can also use the `createState` helper.

```typescript
import { createState, StateResult, PushState } from 'push-down-automata';

const goto = (location: string) => {
  return createState((stack: PushState, context: any) => {
    console.log(`Moving to ${location}`);
    context.location = location;
    return StateResult.PopStateReturn;
  });
};
```

### Creating Sequences

Use `createStateSequence` to chain multiple states together.

```typescript
import { createStateSequence } from 'push-down-automata';

const collectWood = createStateSequence(
  goto("forest"),
  chopTree,
  goto("home"),
);
```

### Running the Automata

```typescript
import { PushDownAutomata } from 'push-down-automata';

const pda = new PushDownAutomata();
const worker = { location: "home", wood: 0 };

// Push an initial state
pda.pushState(collectWood);

// In your game loop:
pda.exec(worker);
```

## State Results

The `StateResult` enum controls the stack behavior:

- `PopStateReturn`: Removes the current state from the stack and stops execution for this `exec` call.
- `KeepStateReturn`: Keeps the current state on the stack and stops execution.
- `PopStateRunNext`: Removes the current state and immediately runs the next state on the stack.
- `KeepStateRunNext`: Keeps the current state (it will be pushed back after new states) and immediately runs the next state.

## License

MIT