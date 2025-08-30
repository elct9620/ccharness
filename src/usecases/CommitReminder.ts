import type {
  WorkingStateBuilder,
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
    private readonly stateBuilder: WorkingStateBuilder,
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

    const state = await this.stateBuilder
      .withMaxFiles(input.options.maxFiles)
      .withMaxLines(input.options.maxLines)
      .withChangedFiles(changedFiles)
      .withChangedLines(changedLines)
      .withUntrackedLines(untrackedLines)
      .build();

    if (!state.isExceeded) {
      await this.decisionPresenter.allow();
      return;
    }

    await this.decisionPresenter.block(state.reason);
  }
}
