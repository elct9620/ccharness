# Service

This document outlines the criteria for evaluating the quality of presenters in CCHarness. For the presenter, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the design and implementation of the presenter. Review step by step and give reasoning to explain why the implementation can get the score.

### Managed Output (1 points)

We never use `console.log` or other direct output methods in the presenter. Instead, the output is injected through the constructor, allowing for better testability and flexibility.

```ts
export class ConsolePresenter {
    constructor(@inject(IConsole) private readonly console: Console) {}

    async display(report: ReviewReport): Promise<void> {
        this.console.log("Review Report:");
        report.evaluations.forEach((eval, index) => {
            this.console.log(`${index + 1}. ${eval.criteria.name}: ${eval.score}`);
            if (eval.comment) {
                this.console.log(`   Comment: ${eval.comment}`);
            }
        });
    }
}
```

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
