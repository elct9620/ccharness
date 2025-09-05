import { describe, it, vi } from "vitest";

import { guardCommitAction } from "@/handlers/hook/GuardCommit";
import type { GitService } from "@/usecases/interface";
import { givenConfig } from "tests/steps/common";
import { givenGitService } from "tests/steps/git";
import { givenHookInput, thenHookOutputShouldBe } from "tests/steps/hook";

describe("Guard Commit", () => {
  describe("when stop hook is already active", () => {
    it("is expected to pass without blocking", async () => {
      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: true,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        reason: "",
      });
    });
  });

  describe("when git is not available", () => {
    it("is expected to pass without blocking", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(false),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        reason: "",
      });
    });
  });

  describe("when changes are within limits", () => {
    it("is expected to pass without blocking", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(5),
        countChangedLines: vi.fn().mockResolvedValue(100),
        countUntrackedLines: vi.fn().mockResolvedValue(50),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        reason: "",
      });
    });
  });

  describe("when files exceed limit", () => {
    it("is expected to block with file count reason", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(15),
        countChangedLines: vi.fn().mockResolvedValue(100),
        countUntrackedLines: vi.fn().mockResolvedValue(50),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        decision: "block",
        reason:
          "There are too many changes in the working directory 15 changed files. Please review and commit your changes before proceeding.",
      });
    });
  });

  describe("when lines exceed limit", () => {
    it("is expected to block with line count reason", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(5),
        countChangedLines: vi.fn().mockResolvedValue(400),
        countUntrackedLines: vi.fn().mockResolvedValue(200),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        decision: "block",
        reason:
          "There are too many changes in the working directory 400 changed lines (+200 untracked lines). Please review and commit your changes before proceeding.",
      });
    });
  });

  describe("when both files and lines exceed limits", () => {
    it("is expected to block with both reasons", async () => {
      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(15),
        countChangedLines: vi.fn().mockResolvedValue(400),
        countUntrackedLines: vi.fn().mockResolvedValue(200),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        decision: "block",
        reason:
          "There are too many changes in the working directory 15 changed files and 400 changed lines (+200 untracked lines). Please review and commit your changes before proceeding.",
      });
    });
  });

  describe("when using config file", () => {
    it("is expected to use config values when CLI options are -1", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 100,
        },
        rubrics: [],
      });

      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(100),
        countUntrackedLines: vi.fn().mockResolvedValue(50),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "-1",
        maxLines: "-1",
      });

      await thenHookOutputShouldBe({
        decision: "block",
        reason:
          "There are too many changes in the working directory 8 changed files and 100 changed lines (+50 untracked lines). Please review and commit your changes before proceeding.",
      });
    });

    it("is expected to prefer CLI options over config when provided", async () => {
      await givenConfig({
        commit: {
          maxFiles: 5,
          maxLines: 100,
        },
        rubrics: [],
      });

      const gitService: Partial<GitService> = {
        isAvailable: vi.fn().mockResolvedValue(true),
        countChangedFiles: vi.fn().mockResolvedValue(8),
        countChangedLines: vi.fn().mockResolvedValue(100),
        countUntrackedLines: vi.fn().mockResolvedValue(50),
      };
      await givenGitService(gitService);

      await givenHookInput({
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "10",
        maxLines: "500",
      });

      await thenHookOutputShouldBe({
        reason: "",
      });
    });
  });

  describe("when limits are disabled", () => {
    it("is expected to pass when both limits are -1 without config", async () => {
      await givenConfig({
        commit: {
          maxFiles: -1,
          maxLines: -1,
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
        sessionId: "test-session",
        transcriptPath: "/tmp/transcript.json",
        cwd: "/project",
        hookEventName: "stop",
        stopHookActive: false,
      });

      await guardCommitAction({
        maxFiles: "-1",
        maxLines: "-1",
      });

      await thenHookOutputShouldBe({
        reason: "",
      });
    });
  });
});
