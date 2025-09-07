# Handler

This document outlines the criteria for evaluating the quality of handlers in CCHarness. For the handler, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the design and implementation of the handler. Review step by step and give reasoning to explain why the implementation can get the score.

### Simple Function (1 points)

The handler is a simple function as an command entry point, which resolves dependencies and invokes the corresponding use case.

```ts
export async function reviewCodeAction(path: string, options: { dryRun: boolean }) {
    // Resolve dependencies with DI container
    const gitService = container.get<GitService>(IGitService);
    const consolePresenter = container.get<ConsolePresenter>(IConsolePresenter);
    // ...
    const reviewCode = new ReviewCode(gitService, consolePresenter, ...);
    await reviewCode.execute({ path, dryRun: options.dryRun });
}
```

- Resolves interfaces instead of concrete implementations.
- Allow temporary business logic when early stage, always refactor to use case after stable.

> [!NOTE]
> The temporary business usually happens a new handler for dummy input/output. Refactor will happen after first end-to-end test is ready.

### Stateless (1 points)

The handler should be stateless, meaning it does not maintain any internal state between invocations. This ensures that each invocation is independent and does not affect subsequent calls.

```ts
export async function reviewCodeAction(path: string, options: { dryRun: boolean }) {
    // No internal state is maintained
    const gitService = container.get<GitService>(IGitService);
    const consolePresenter = container.get<ConsolePresenter>(IConsolePresenter);
    // ...
    const reviewCode = new ReviewCode(gitService, consolePresenter, ...);
    await reviewCode.execute({ path, dryRun: options.dryRun });
}
```

The DI container is used to resolve dependencies with factory mode by default, so each invocation gets a fresh instance. If stateful is necessary, it already configured in the DI container.

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
