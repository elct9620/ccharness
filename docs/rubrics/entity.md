# Entity

This document outlines the criteria for evaluating the quality of tests in CCHarness. For the entity, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the design and implementation of the entity. Review step by step and give reasoning to explain why the implementation can get the score.

### Rich Model (1 points)

The entity should encapsulate both data and behavior, providing methods that operate on its own data. The methods should represent meaningful business operations.

```ts
// Value Object
export class Evaluation {
    constructor(
      public readonly score: number,
      public readonly comment: string,
    ) {}

    isPassing(threshold: number): boolean {
        return this.score >= threshold;
    }
}

// Entity
export class Review {
    private _evaluations: Evaluation[] = [];

    constructor(
      public readonly id: string,
      public readonly code: string,
    ) {}

    addEvaluation(evaluation: Evaluation): void {
        this._evaluations.push(evaluation);
    }

    get evaluations(): Evaluation[] {
        return [...this._evaluations];
    }
}
```

- The attributes are private or readonly to prevent modification from outside the class.
- Use methods to manipulate the entity's state instead of exposing setters.

### Identity (1 points)

When defining an entity with a unique identity, ensure that the identity is clearly defined and immutable.

```ts
export class Review {
    private _state: "pending" | "completed" = "pending";

    constructor(
      public readonly id: string,
    ) {}

    complete(): void {
        this._state = "completed";
    }
}
```

- The entity has a unique identifier (e.g., `id`) or anything that can uniquely identify it.
- The identity is immutable and does not change over the entity's lifecycle.
- If no unique identifier, review is a value object and give this critera directly.

### Immutable Value Objects (1 points)

When defining value objects, ensure they are immutable. This means that once a value object is created, its state cannot be changed.

```ts
export class Evaluation {
    constructor(
      public readonly score: number,
      public readonly comment: string,
    ) {}

    addScore(additionalScore: number): Evaluation {
        return new Evaluation(this.score + additionalScore, this.comment);
    }
}
```

- All properties of the value object are readonly.
- Methods that would modify the state return a new instance instead.
- Give score if not a value object but an entity.

### Value Object over primitive (1 points)

When a value object is used to represent a concept in the domain, it should encapsulate the relevant data and behavior, rather than using primitive types.

```ts
// Type alias to represent a specific concept
export const type ReviewState = "pending" | "completed";

// Value Object
export class WorkingState {
    constructor(
      public readonly maxChangedFiles: number,
    ) {}

    isExceeded(changedFiles: number): boolean {
        return changedFiles > this.maxChangedFiles;
    }
}
```

- Only use primitive types (e.g., `string`, `number`, `boolean`) for simple data that does not have associated behavior.
- Use value objects to encapsulate related data and behavior for domain concepts.

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
