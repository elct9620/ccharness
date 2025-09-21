import type {
  FeatureService,
  GitService,
  StopDecisionPresenter,
  WorkingStateBuilder,
} from "./interface";
import type { StopHookInput } from "./port";

export type GuardCommitInput = {
  hook: StopHookInput;
  options: {
    maxFiles: number;
    maxLines: number;
  };
};

export class GuardCommit {
  constructor(
    private readonly featureService: FeatureService,
    private readonly gitService: GitService,
    private readonly stateBuilder: WorkingStateBuilder,
    private readonly decisionPresenter: StopDecisionPresenter,
  ) {}

  async execute(input: GuardCommitInput): Promise<void> {
    if (this.featureService.isDisabled("HOOK")) {
      await this.decisionPresenter.pass();
      return;
    }

    if (input.hook.stopHookActive) {
      await this.decisionPresenter.pass();
      return;
    }

    const isGitAvailable = await this.gitService.isAvailable();
    if (!isGitAvailable) {
      await this.decisionPresenter.pass();
      return;
    }

    const changedFiles = await this.gitService.countChangedFiles();
    const changedLines = await this.gitService.countChangedLines();
    const untrackedLines = await this.gitService.countUntrackedLines();

    const state = await this.stateBuilder
      .useConfigFile()
      .withMaxFiles(input.options.maxFiles)
      .withMaxLines(input.options.maxLines)
      .withChangedFiles(changedFiles)
      .withChangedLines(changedLines)
      .withUntrackedLines(untrackedLines)
      .build();

    if (!state.isExceeded) {
      await this.decisionPresenter.pass();
      return;
    }

    await this.decisionPresenter.block(state.reason);
  }
}
