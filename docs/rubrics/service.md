# Service

This document outlines the criteria for evaluating the quality of services in CCHarness. For the service, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the design and implementation of the service. Review step by step and give reasoning to explain why the implementation can get the score.

### Boring Implementation (1 points)

The service usually implements interfaces defined in the use case layer. The implementation should be straightforward, focusing on fulfilling the contract without adding unnecessary complexity.

```ts
export class GitService implements IGitService {
    async getChangedFiles(path: string): Promise<string[]> {
        // Simple implementation using git commands
        const result = await exec(`git -C ${path} diff --name-only HEAD`);
        return result.stdout.split("\n").filter(file => file);
    }
}
```

- When implementing an interface, the `implements` keyword is used to ensure the class adheres to the contract.
- When implementing utility classes, keep simple and minimal which is used by other services or classes.

### Naming Conventions (1 points)

The service is designed to provide a specific functionality which related to low-level operations. The naming should reflect its purpose clearly.

```ts
class CmdGitService implements IGitService { // Use "Cmd" prefix to indicate command-line based implementation
    // Implementation details...
}

class JsonWorkingStateBuilder { // Use "Builder" suffix to indicate a builder pattern
    // Implementation details...
}
```

- When matching design patterns, use standard naming conventions like `Builder`, `Factory`, `Adapter`, etc.
- When implementing interfaces, use prefixes or suffixes to indicate the implementation type, such as `Cmd`, `InMemory`, `Http`, etc.

### Injection Ready (1 points)

The service should be designed to be injectable, use dependency injection principles to allow easy substitution and testing.

```ts
@injectable()
export class GitService implements IGitService {
    constructor(
        @inject(ILogger) private readonly logger: ILogger,
    ) {}

    async getChangedFiles(path: string): Promise<string[]> {
        this.logger.log(`Fetching changed files from path: ${path}`);
        // Implementation details...
    }
}
```

- We use `tsyringe` for dependency injection, marking services with `@injectable()` decorator.
- Use stateless design by default, avoid singletons unless necessary.

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
