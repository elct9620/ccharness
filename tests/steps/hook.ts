import { Readable } from "stream";
import type { TestConsole } from "tests/support/TestConsole";
import { container } from "tsyringe";
import { expect } from "vitest";

import { IConsole, IHookInputStream } from "@/token";

export async function givenHookInput(input: string) {
  container.register(IHookInputStream, {
    useValue: Readable.from([input]),
  });
}

export async function thenHookOutputShouldBeEmpty() {
  const testConsole = container.resolve<TestConsole>(IConsole);
  expect(testConsole.outputString).toBe("");
}

export async function thenHookOutputShouldBe(decision: object) {
  const testConsole = container.resolve<TestConsole>(IConsole);
  expect(testConsole.outputString).toBe(JSON.stringify(decision) + "\n");
}
