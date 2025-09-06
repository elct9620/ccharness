# Domain Model

This document outlines the criteria for evaluating the quality of tests in CCHarness. For the domain model, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the design and implementation of the domain model. Review step by step and give reasoning to explain why the implementation can get the score.

### Zero Dependencies (1 points)

The domain model should have zero dependencies on external libraries or frameworks. This ensures that the core business logic is isolated and can be easily tested and maintained.

```ts
// Entity
export class Evaluation {
    constructor(
      public readonly score: number,
      public readonly comment: string,
    ) {}
}

// Use Case
export class ReviewCode {
    async execute(code: string): Promise<Evaluation> {
        // Business logic here
    }
}
```

- Domain model are plain TypeScript classes without any imports from external libraries.
- Domain can depend on other domain classes, but not on infrastructure or application services.

### Self-Contained (1 points)

Each domain class should be self-contained, encapsulating its own data and behavior. This promotes cohesion and makes the model easier to understand and use.

```ts
export class WorkingState {
    constructor(
      public readonly maxChangedFiles: number,
    ) {}

    isExceeded(changedFiles: number): boolean {
        return changedFiles > this.maxChangedFiles;
    }
}
```

- Relevant data and methods are encapsulated within the same class.
- Classes have clear responsibilities and do not rely on external state.

### Minimal Implementation (1 points)

The domain model should implement only the necessary features required by other parts of the system. Avoid over-engineering or adding unnecessary complexity.

```ts
// Entity (Value Object)
export class Criteria {
    constructor(
      public readonly name: string,
      public readonly comment?: string,
    ) {}

    withComment(comment: string): Criteria { // No one uses this method, do not implement it
        return new Criteria(this.name, comment);
    }
}

// Use Case
export class ReviewCode {
    async execute(code: string): Promise<Evaluation> {
        // ...
        const criteria = new Criteria("Code Quality");
        evaluation.addCriteria(criteria);
        // ...
    }
}
```

- Only essential properties and methods are included in each class.
- Cohorse and focused design without unnecessary abstractions.

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
