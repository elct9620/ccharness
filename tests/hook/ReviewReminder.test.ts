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
    it("is expected to have additional context to remind self-review", async () => {
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
            "Ensure self-review changes against @docs/rubrics/vitest.md, keep it simple before next change is made.",
        },
      });
    });
  });

  describe('when the tool is "Edit" with rubrics', () => {
    it("is expected to have additional context to remind self-review", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "vitest",
            pattern: "\\.test\\.ts$",
            path: "docs/rubrics/vitest.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Edit",
        toolResponse: {
          filePath: "tests/hook/ReviewReminder.test.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "Ensure self-review changes against @docs/rubrics/vitest.md, keep it simple before next change is made.",
        },
      });
    });
  });

  describe('when the tool is "MultiEdit" with rubrics', () => {
    it("is expected to have additional context to remind self-review", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "typescript",
            pattern: "\\.ts$",
            path: "docs/rubrics/typescript.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "MultiEdit",
        toolResponse: {
          filePath: "src/handlers/hook/ReviewReminder.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "Ensure self-review changes against @docs/rubrics/typescript.md, keep it simple before next change is made.",
        },
      });
    });
  });

  describe("when multiple rubrics match the file", () => {
    it("is expected to include all matching rubric references", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "typescript",
            pattern: "\\.ts$",
            path: "docs/rubrics/typescript.md",
          },
          {
            name: "testing",
            pattern: "\\.test\\.ts$",
            path: "docs/rubrics/testing.md",
          },
          {
            name: "hooks",
            pattern: "hook/.*\\.test\\.ts$",
            path: "docs/rubrics/hooks.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "tests/hook/ReviewReminder.test.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "Ensure self-review changes against @docs/rubrics/typescript.md, @docs/rubrics/testing.md, @docs/rubrics/hooks.md, keep it simple before next change is made.",
        },
      });
    });
  });

  describe("when rubrics exist but none match the file", () => {
    it("is expected to allow without additional context", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "python",
            pattern: "\\.py$",
            path: "docs/rubrics/python.md",
          },
          {
            name: "javascript",
            pattern: "\\.js$",
            path: "docs/rubrics/javascript.md",
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
        },
      });
    });
  });

  describe("when config has empty rubrics array", () => {
    it("is expected to allow without additional context", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [],
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
        },
      });
    });
  });

  describe("when testing different file path formats", () => {
    it("is expected to match relative paths", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "nested",
            pattern: "nested/.*\\.ts$",
            path: "docs/rubrics/nested.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/nested/deep/file.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "Ensure self-review changes against @docs/rubrics/nested.md, keep it simple before next change is made.",
        },
      });
    });

    it("is expected to match absolute paths", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "absolute",
            pattern: "/.*project/.*\\.ts$",
            path: "docs/rubrics/absolute.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Edit",
        toolResponse: {
          filePath: "/home/user/project/src/index.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "Ensure self-review changes against @docs/rubrics/absolute.md, keep it simple before next change is made.",
        },
      });
    });
  });

  describe("when hook input has unsupported tools", () => {
    it("is expected to return empty for Read tool", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "typescript",
            pattern: "\\.ts$",
            path: "docs/rubrics/typescript.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Read",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBeEmpty();
    });

    it("is expected to return empty for Bash tool", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [
          {
            name: "typescript",
            pattern: "\\.ts$",
            path: "docs/rubrics/typescript.md",
          },
        ],
      });

      await givenHookInput({
        toolName: "Bash",
        toolResponse: {
          output: "command executed",
        },
      });

      await reviewReminderAction();
      await thenHookOutputShouldBeEmpty();
    });
  });
});
