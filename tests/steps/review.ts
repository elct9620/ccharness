import type { TestConsole } from "tests/support/TestConsole";
import { TestReviewService } from "tests/support/TestReviewService";
import { container } from "tsyringe";
import { expect, vi } from "vitest";

import { IConsole } from "@/token";
import { IReviewService } from "@/usecases/interface";

export async function givenReviewService() {
  const reviewService = new TestReviewService();

  const spy = vi.spyOn(reviewService, "review");
  container.register(IReviewService, {
    useValue: reviewService,
  });

  return spy;
}

export async function thenReviewOutputShouldBe(expectedOutput: string) {
  const testConsole = container.resolve<TestConsole>(IConsole);
  const expected = expectedOutput === "" ? "" : expectedOutput + "\n";
  expect(testConsole.outputString).toBe(expected);
}
