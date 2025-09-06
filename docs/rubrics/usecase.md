# Use Case

This document outlines the criteria for evaluating the quality of tests in CCHarness. For the use case, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the design and implementation of the use case. Review step by step and give reasoning to explain why the implementation can get the score.

### Dependency Injection (1 points)

The use case defines interfaces which are implemented by other layers, and use dependency injection to decouple the use case from its dependencies.

```ts
// src/usecases/interface.ts
export const ICodeReviewer = Symbol("ICodeReviewer");
export interface CodeReviewer {
    review(code: string): Promise<Evaluation>;
}

// src/usecases/ReviewCode.ts
export class ReviewCode {
    constructor(private readonly reviewer: CodeReviewer) {}

    async execute(input: ReviewCodeInput): Promise<void> {
        this.reviewer.review(code);
    }
}
```

- All dependencies are injected through the constructor as readonly properties.
- Never instantiate dependencies directly within the use case.

### Execute Method (1 points)

The use case exposes a single `execute` method that encapsulates the business logic.

```ts
export class ReviewCode {
    async execute(input: ReviewCodeInput): Promise<void> {
        // Business logic here
    }
}
```

- Only one public method named `execute`.
- The `execute` method takes a single input parameter and returns void or throws an error.

### Input Models (1 points)

Never use parameters directly in the `execute` method. Instead, define input models to encapsulate the data.

```ts
import { Evaluation } from "@/entities/Evaluation";

export type ReviewCodeInput = {
    code: string;
};

export class ReviewCode {
    async execute(input: ReviewCodeInput): Promise<void> {
        const { code } = input;
        // Business logic here
    }
}
```

- Define input types (e.g., `ReviewCodeInput`) to encapsulate all parameters.
- Use presenter interface to output if necessary.

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
