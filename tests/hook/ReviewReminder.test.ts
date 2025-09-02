import { describe, it } from "vitest";

import { reviewReminderAction } from "@/handlers/hook/ReviewReminder";
import {
  givenHookInput,
  thenHookOutputShouldBe,
  thenHookOutputShouldBeEmpty,
} from "tests/steps/hook";

describe("Review Reminder Action", () => {
  describe("when the tool is not supported", () => {
    it("is expected to allow without output", async () => {
      await givenHookInput("{}");
      await reviewReminderAction();
      await thenHookOutputShouldBeEmpty();
    });
  });

  describe("when the tool is supported", () => {
    it("is expected to remind to review", async () => {
      await givenHookInput(
        JSON.stringify({
          toolName: "Write",
          toolResponse: {
            filePath: "src/index.ts",
          },
        }),
      );
      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {},
      });
    });
  });
});
