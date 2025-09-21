import type {
  FeatureService,
  GitService,
  PostToolUseDecisionPresenter,
  WorkingStateBuilder,
} from "./interface";
import type { PostToolUseHookInput } from "./port";

export type CommitReminderInput = {
  hook: PostToolUseHookInput;
  message?: string;
  options: {
    maxFiles: number;
    maxLines: number;
  };
};

export class CommitReminder {
  private static readonly DEFAULT_MESSAGE =
    "You have changed {changedFiles} files and {changedLines} lines without committing. Consider making a commit to save your progress.";

  constructor(
    private readonly featureService: FeatureService,
    private readonly gitService: GitService,
    private readonly stateBuilder: WorkingStateBuilder,
    private readonly presenter: PostToolUseDecisionPresenter,
  ) {}

  async execute(input: CommitReminderInput): Promise<void> {
    if (this.featureService.isDisabled("HOOK")) {
      return;
    }

    const isGitAvailable = await this.gitService.isAvailable();
    if (!isGitAvailable) {
      return;
    }

    const changedFiles = await this.gitService.countChangedFiles();
    const changedLines = await this.gitService.countChangedLines();
    const untrackedLines = await this.gitService.countUntrackedLines();

    const workingState = await this.stateBuilder
      .useConfigFile()
      .withMaxFiles(input.options.maxFiles)
      .withMaxLines(input.options.maxLines)
      .withChangedFiles(changedFiles)
      .withChangedLines(changedLines)
      .withUntrackedLines(untrackedLines)
      .build();

    if (!workingState.isExceeded) {
      await this.presenter.pass();
      return;
    }

    const message = this.buildReminderMessage(
      input.message,
      workingState.changedFiles,
      workingState.changedLines,
    );
    await this.presenter.pass(message);
  }

  private buildReminderMessage(
    message: string | undefined,
    changedFiles: number,
    changedLines: number,
  ): string {
    const template = message ?? CommitReminder.DEFAULT_MESSAGE;

    return template
      .replace("{changedFiles}", changedFiles.toString())
      .replace("{changedLines}", changedLines.toString());
  }
}
