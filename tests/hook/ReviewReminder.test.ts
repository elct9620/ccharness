import { describe, expect, it } from "vitest";

import { IConsole } from "@/container";
import { reviewReminderAction } from "@/handlers/hook/ReviewReminder";
import type { TestConsole } from "tests/support/TestConsole";
import { container } from "tsyringe";

describe("Review Reminder Action", () => {
  describe("when the tool is not allowed", () => {
    it("is expected to allow without output", async () => {
      const testConsole = container.resolve<TestConsole>(IConsole);

      await reviewReminderAction();
      expect(testConsole.outputString).toBe("");
    });
  });
});
