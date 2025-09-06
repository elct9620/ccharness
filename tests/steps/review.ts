import type { TestConsole } from "tests/support/TestConsole";
import {
  TestReviewService,
  type EvaluationData,
} from "tests/support/TestReviewService";
import { container } from "tsyringe";
import { expect } from "vitest";

import { IConsole } from "@/token";
import { IReviewService } from "@/usecases/interface";

export async function givenReviewResult(evaluations: EvaluationData[]) {
  const reviewService = new TestReviewService();
  reviewService.setEvaluationData(evaluations);

  container.register(IReviewService, {
    useValue: reviewService,
  });
}

export async function givenReviewFailures(
  rubricName: string,
  failureCount: number,
) {
  const reviewService = container.resolve<TestReviewService>(IReviewService);
  reviewService.setFailureCount(rubricName, failureCount);
}

export async function thenReviewAttemptCountShouldBe(
  rubricName: string,
  expectedCount: number,
) {
  const reviewService = container.resolve<TestReviewService>(IReviewService);
  expect(reviewService.getAttemptCount(rubricName)).toBe(expectedCount);
}

export async function thenReviewOutputShouldBe(expectedOutput: string) {
  const testConsole = container.resolve<TestConsole>(IConsole);
  const expected = expectedOutput === "" ? "" : expectedOutput + "\n";
  expect(testConsole.outputString).toBe(expected);
}

export async function thenReviewOutputShouldContain(
  expectedText: string | RegExp,
) {
  const testConsole = container.resolve<TestConsole>(IConsole);
  expect(testConsole.outputString).toMatch(expectedText);
}
