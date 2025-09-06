import type { TestConsole } from "tests/support/TestConsole";
import { container } from "tsyringe";
import { expect } from "vitest";

import { IConsole } from "@/token";

export async function thenReviewOutputShouldBe(expectedOutput: string) {
  const testConsole = container.resolve<TestConsole>(IConsole);
  const expected = expectedOutput === "" ? "" : expectedOutput + "\n";
  expect(testConsole.outputString).toBe(expected);
}
