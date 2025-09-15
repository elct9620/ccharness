import type { ConfigSchema } from "@/constant";
import type { GitService, PostToolUseDecisionPresenter } from "./interface";
import type { PostToolUseHookInput } from "./port";

export type CommitReminderInput = {
  hook: PostToolUseHookInput;
  config: ConfigSchema;
  options: {
    maxFiles: number;
    maxLines: number;
  };
};

export class CommitReminder {
  private static readonly ALLOWED_TOOLS = ["Write", "Edit", "MultiEdit"];
  private static readonly DEFAULT_MESSAGE =
    "You have changed {changedFiles} files and {changedLines} lines without committing. Consider making a commit to save your progress.";

  constructor(
    private readonly gitService: GitService,
    private readonly presenter: PostToolUseDecisionPresenter,
  ) {}

  async execute(input: CommitReminderInput): Promise<void> {
    if (!CommitReminder.ALLOWED_TOOLS.includes(input.hook.toolName)) {
      return;
    }

    const isGitAvailable = await this.gitService.isAvailable();
    if (!isGitAvailable) {
      return;
    }

    const changedFiles = await this.gitService.countChangedFiles();
    const changedLines = await this.gitService.countChangedLines();
    const untrackedLines = await this.gitService.countUntrackedLines();

    const { maxFiles, maxLines } = this.resolveThresholds(input);

    const shouldRemind = this.shouldRemind(
      changedFiles,
      changedLines,
      maxFiles,
      maxLines,
    );
    if (!shouldRemind) {
      await this.presenter.pass();
      return;
    }

    const message = this.buildReminderMessage(
      input.config,
      changedFiles,
      changedLines,
    );
    await this.presenter.pass(message);
  }

  private resolveThresholds(input: CommitReminderInput): {
    maxFiles: number;
    maxLines: number;
  } {
    const { config, options } = input;

    // CLI options take precedence over config
    const maxFiles =
      options.maxFiles !== -1
        ? options.maxFiles
        : (config.commit.reminder?.maxFiles ?? config.commit.maxFiles);

    const maxLines =
      options.maxLines !== -1
        ? options.maxLines
        : (config.commit.reminder?.maxLines ?? config.commit.maxLines);

    return { maxFiles, maxLines };
  }

  private shouldRemind(
    changedFiles: number,
    changedLines: number,
    maxFiles: number,
    maxLines: number,
  ): boolean {
    if (maxFiles === -1 && maxLines === -1) {
      return false;
    }

    const filesExceeded = maxFiles !== -1 && changedFiles >= maxFiles;
    const linesExceeded = maxLines !== -1 && changedLines >= maxLines;

    return filesExceeded || linesExceeded;
  }

  private buildReminderMessage(
    config: ConfigSchema,
    changedFiles: number,
    changedLines: number,
  ): string {
    const template =
      config.commit.reminder?.message ?? CommitReminder.DEFAULT_MESSAGE;

    return template
      .replace("{changedFiles}", changedFiles.toString())
      .replace("{changedLines}", changedLines.toString());
  }
}
