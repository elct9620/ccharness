# Testing Steps

This document outlines the criteria for evaluating the quality of tests in CCHarness. For each test step, we assert its quality passed over 80% rubric score.

## Criteria

Following are the criteria used to evaluate the quality of test steps, review step by step and give reasoning to explain why implementation can get the score.

### Stateless (1 points)

For each step function, it should be stateless without relying on any local or global variable, and can be reused in different test cases.

```ts
export async function thenHookOutputShouldBeEmpty() {
  const output = container.resolve(HookOutputService);
  expect(output.getMessages()).toHaveLength(0);
}
```

The output service is resolved inside the function, so it no need to rely on any local or global variable.

### Composable (1 points)

The step function should be composable, which means it can be used in different test cases without any modification.

```ts
export async function thenFeatureShouldBeEnabled(feature: string) {
  const featureService = container.resolve(IFeatureService);
  expect(featureService.isEnabled(feature)).toBe(true);
}
```

The parameter `feature` can be passed in different test cases, we should not depend on local or global variable or pass step output to next step.

## Scoring

Each criterion only get the point when it is fully satisfied, otherwise get 0 point.
