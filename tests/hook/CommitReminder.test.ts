import { describe, it, vi } from "vitest";

import { commitReminderAction } from "@/handlers/hook/CommitReminder";
import type { GitService } from "@/usecases/interface";
import { givenConfig } from "tests/steps/common";
import { givenGitService } from "tests/steps/git";
import {
  givenHookInput,
  thenHookOutputShouldBe,
  thenHookOutputShouldBeEmpty,
} from "tests/steps/hook";

describe("Commit Reminder", () => {
  describe("when the tool is not supported", () => {
    it("is expected to pass without output", async () => {
      await givenHookInput({
        toolName: "Read",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });
      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });
      await thenHookOutputShouldBeEmpty();
    });
  });

  describe("when git is not available", () => {
    it("is expected to pass without output", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(false),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBeEmpty();
    });
  });

  describe("when changes are within limits", () => {
    it("is expected to pass without reminder", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(3),
        countChangedLines: vi.fn().mockResolvedValue(30),
        countUntrackedLines: vi.fn().mockResolvedValue(10),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
        },
      });
    });
  });

  describe("when file count exceeds limit", () => {
    it("is expected to provide reminder with default message", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(30),
        countUntrackedLines: vi.fn().mockResolvedValue(10),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Edit",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 8 files and 30 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });
  });

  describe("when line count exceeds limit", () => {
    it("is expected to provide reminder with default message", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(3),
        countChangedLines: vi.fn().mockResolvedValue(60),
        countUntrackedLines: vi.fn().mockResolvedValue(20),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "MultiEdit",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 3 files and 60 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });
  });

  describe("when both file and line counts exceed limits", () => {
    it("is expected to provide reminder with default message", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(40),
        countUntrackedLines: vi.fn().mockResolvedValue(20),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 8 files and 40 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });
  });

  describe("when using custom message from config", () => {
    it("is expected to use configured reminder message", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 50,
          reminder: {
            maxFiles: 3,
            maxLines: 30,
            message:
              "To make outside-in with small increments, you have make too many changes without committing. Make sure you have create minimal tests and pass them before commit.",
          },
        },
        rubrics: [],
      });

      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(5),
        countChangedLines: vi.fn().mockResolvedValue(25),
        countUntrackedLines: vi.fn().mockResolvedValue(10),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "-1",
        maxLines: "-1",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "To make outside-in with small increments, you have make too many changes without committing. Make sure you have create minimal tests and pass them before commit.",
        },
      });
    });
  });

  describe("when using config defaults without reminder section", () => {
    it("is expected to inherit from commit config and use default message", async () => {
      await givenConfig({
        commit: {
          maxFiles: 3,
          maxLines: 30,
        },
        rubrics: [],
      });

      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(5),
        countChangedLines: vi.fn().mockResolvedValue(25),
        countUntrackedLines: vi.fn().mockResolvedValue(10),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Edit",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "-1",
        maxLines: "-1",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 5 files and 25 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });
  });

  describe("when CLI options override config", () => {
    it("is expected to prefer CLI options over config values", async () => {
      await givenConfig({
        commit: {
          maxFiles: 3,
          maxLines: 30,
          reminder: {
            maxFiles: 2,
            maxLines: 20,
            message: "Config message",
          },
        },
        rubrics: [],
      });

      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(4),
        countChangedLines: vi.fn().mockResolvedValue(25),
        countUntrackedLines: vi.fn().mockResolvedValue(10),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "10", // CLI override should allow this
        maxLines: "50", // CLI override should allow this
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
        },
      });
    });
  });

  describe("when limits are disabled", () => {
    it("is expected to pass without reminder when both limits are -1", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
          reminder: {
            maxFiles: -1,
            maxLines: -1,
          },
        },
        rubrics: [],
      });

      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(100),
        countChangedLines: vi.fn().mockResolvedValue(1000),
        countUntrackedLines: vi.fn().mockResolvedValue(500),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "MultiEdit",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "-1",
        maxLines: "-1",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
        },
      });
    });
  });

  describe("when only file limit is enabled", () => {
    it("is expected to check only file count", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(1000), // Should be ignored
        countUntrackedLines: vi.fn().mockResolvedValue(500),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "-1", // Disabled
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 8 files and 1000 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });
  });

  describe("when only line limit is enabled", () => {
    it("is expected to check only line count", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(100), // Should be ignored
        countChangedLines: vi.fn().mockResolvedValue(60),
        countUntrackedLines: vi.fn().mockResolvedValue(20),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Edit",
        toolResponse: {
          filePath: "src/index.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "-1", // Disabled
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 100 files and 60 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });
  });

  describe("when testing different tool types", () => {
    it("is expected to handle Write tool", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(40),
        countUntrackedLines: vi.fn().mockResolvedValue(20),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Write",
        toolResponse: {
          filePath: "src/new-file.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 8 files and 40 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });

    it("is expected to handle Edit tool", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(40),
        countUntrackedLines: vi.fn().mockResolvedValue(20),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "Edit",
        toolResponse: {
          filePath: "src/existing-file.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 8 files and 40 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });

    it("is expected to handle MultiEdit tool", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(40),
        countUntrackedLines: vi.fn().mockResolvedValue(20),
      };
      await givenGitService(gitService);

      await givenHookInput({
        toolName: "MultiEdit",
        toolResponse: {
          filePath: "src/batch-edited.ts",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBe({
        reason: "",
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "You have changed 8 files and 40 lines without committing. Consider making a commit to save your progress.",
        },
      });
    });

    it("is expected to ignore unsupported tools", async () => {
      await givenHookInput({
        toolName: "Bash",
        toolResponse: {
          output: "command executed",
        },
      });

      await commitReminderAction({
        maxFiles: "5",
        maxLines: "50",
      });

      await thenHookOutputShouldBeEmpty();
    });
  });
});
