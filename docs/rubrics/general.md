# General

This document outlines the criteria for evaluating the quality of entities in CCHarness. For the code, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the implementation of the TypeScript code. Review step by step and give reasoning to explain why the implementation can get the score.

### Early Return (1 points)

When checking for conditions, use early returns to reduce nesting and improve readability.

```ts
function process(input: string | null): string {
    if (input === null) {
        return "default";
    }
    // Main logic here
    return input.toUpperCase();
}
```

- Avoid deep nesting by returning early when conditions are not met.
- Prevent duplicated return if possible.
