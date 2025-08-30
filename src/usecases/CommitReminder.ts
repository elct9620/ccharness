import type { GitService, StopDecisionPresenter } from "./interface";

export class CommitReminder {
  constructor(
    private readonly gitService: GitService,
    private readonly decisionPresenter: StopDecisionPresenter,
  ) {}

  async execute(): Promise<void> {
    const MAX_CHANGED_FILES = 10;
    const MAX_CHANGED_LINES = 500;

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

    const hasTooManyChangedFiles = changedFiles > MAX_CHANGED_FILES;
    const hasTooManyChangedLines =
      changedLines + untrackedLines > MAX_CHANGED_LINES;
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
