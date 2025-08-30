import type {
  CommitConfigBuilder,
  GitService,
  StopDecisionPresenter,
} from "./interface";
import type { StopHookInput } from "./port";

export type CommitReminderInput = {
  hook: StopHookInput;
  options: {
    maxFiles: number;
    maxLines: number;
  };
};

export class CommitReminder {
  constructor(
    private readonly gitService: GitService,
    private readonly configBuilder: CommitConfigBuilder,
    private readonly decisionPresenter: StopDecisionPresenter,
  ) {}

  async execute(input: CommitReminderInput): Promise<void> {
    if (input.hook.stopHookActive) {
      await this.decisionPresenter.allow();
      return;
    }

    const isGitAvailable = await this.gitService.isAvailable();
    if (!isGitAvailable) {
      await this.decisionPresenter.allow();
      return;
    }

    const changedFiles = await this.gitService.countChangedFiles();
    const changedLines = await this.gitService.countChangedLines();
    const untrackedLines = await this.gitService.countUntrackedLines();

    const hasChanges =
      changedFiles > 0 || changedLines > 0 || untrackedLines > 0;
    if (!hasChanges) {
      await this.decisionPresenter.allow();
      return;
    }

    const config = await this.configBuilder
      .withMaxFiles(input.options.maxFiles)
      .withMaxLines(input.options.maxLines)
      .build();

    const hasTooManyChangedFiles = config.isExceededMaxFiles(changedFiles);
    const hasTooManyChangedLines = config.isExceededMaxLines(
      changedLines + untrackedLines,
    );
    const hasTooManyChanges = hasTooManyChangedFiles && hasTooManyChangedLines;

    let reason = "";
    if (hasTooManyChanges) {
      reason = `There are too many changes in the working directory: ${changedFiles} changed files and ${changedLines} changed lines (+${untrackedLines} untracked lines). Please commit your changes before proceeding.`;
    } else if (hasTooManyChangedFiles) {
      reason = `There are too many changed files in the working directory: ${changedFiles} changed files. Please commit your changes before proceeding.`;
    } else if (hasTooManyChangedLines) {
      reason = `There are too many changed lines in the working directory: ${changedLines} changed lines (+${untrackedLines} untracked lines). Please commit your changes before proceeding.`;
    }

    if (reason.length === 0) {
      await this.decisionPresenter.allow();
      return;
    }

    await this.decisionPresenter.block(reason);
  }
}
