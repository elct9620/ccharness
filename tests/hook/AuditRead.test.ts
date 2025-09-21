import { afterEach, describe, it, vi } from "vitest";

import { auditReadAction } from "@/handlers/hook/AuditRead";
import { givenConfig, givenEnvironmentVariable } from "tests/steps/common";
import { givenHookInput, thenHookOutputShouldBe } from "tests/steps/hook";

describe("Audit Read", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("when CCHARNESS_HOOK_DISABLED is set to '1'", () => {
    it("is expected to allow immediately without checks", async () => {
      givenEnvironmentVariable("CCHARNESS_HOOK_DISABLED", "1");

      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["*.env", "**/.env*", "**/secrets/**"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: ".env",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });

  describe("when CCHARNESS_HOOK_DISABLED is set to 'true'", () => {
    it("is expected to allow immediately without checks", async () => {
      givenEnvironmentVariable("CCHARNESS_HOOK_DISABLED", "true");

      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["*.env", "**/.env*", "**/secrets/**"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: "secrets/api-keys.txt",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });
  describe("when file is not sensitive", () => {
    it("is expected to allow access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["path/to/sensitive/file.txt", "another/sensitive/*.log"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: "normal/file.txt",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });

  describe("when file matches exact sensitive path", () => {
    it("is expected to deny access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["path/to/sensitive/file.txt", "another/sensitive/*.log"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: "path/to/sensitive/file.txt",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "The file path 'path/to/sensitive/file.txt' is restricted.",
        },
      });
    });
  });

  describe("when file matches glob pattern", () => {
    it("is expected to deny access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["path/to/sensitive/file.txt", "another/sensitive/*.log"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: "another/sensitive/debug.log",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "The file path 'another/sensitive/debug.log' is restricted.",
        },
      });
    });
  });

  describe("when no audit configuration exists", () => {
    it("is expected to allow access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: "any/file.txt",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });

  describe("when audit.read is empty array", () => {
    it("is expected to allow access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: [],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: "any/file.txt",
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });

  describe("when toolInput has no file_path", () => {
    it("is expected to allow access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["path/to/sensitive/file.txt"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {},
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });

  describe("when file_path is not a string", () => {
    it("is expected to allow access", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
        },
        review: {
          blockMode: false,
        },
        audit: {
          read: ["path/to/sensitive/file.txt"],
        },
        rubrics: [],
      });

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "PreToolUse",
        toolName: "Read",
        toolInput: {
          file_path: 123,
        },
      });

      await auditReadAction();

      await thenHookOutputShouldBe({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
      });
    });
  });
});
