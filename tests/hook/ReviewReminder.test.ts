import { describe, it } from "vitest";

import { reviewReminderAction } from "@/handlers/hook/ReviewReminder";
import { givenConfig } from "tests/steps/common";
import {
  givenHookInput,
  thenHookOutputShouldBe,
  thenHookOutputShouldBeEmpty,
} from "tests/steps/hook";

describe("Review Reminder", () => {
  describe("when the tool is not supported", () => {
    it("is expected to allow without output", async () => {
      await givenHookInput({});
      await reviewReminderAction();
      await thenHookOutputShouldBeEmpty();
    });
  });

  describe("when the tool is supported without rubrics", () => {
    it("is expected to allow without reason", async () => {
      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });
      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
        },
      });
    });
  });

  describe('when the tool is "Write" with rubrics', () => {
    it("is expected to have addational context to remind self-review", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "vitest",
            pattern: "\\.ts$",
            path: "docs/rubrics/vitest.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "Review changes against @docs/rubrics/vitest.md, keep it simple, then continue iterating.",
        },
      });
    });
  });
});
