import type {
  FeatureService,
  PatternMatcher,
  PreToolUseDecisionPresenter,
} from "./interface";
import type { PreToolUseHookInput } from "./port";

export type AuditReadInput = {
  hook: PreToolUseHookInput;
  options: {
    sensitivePatterns: string[];
  };
};

export class AuditRead {
  constructor(
    private readonly featureService: FeatureService,
    private readonly patternMatcher: PatternMatcher,
    private readonly decisionPresenter: PreToolUseDecisionPresenter,
  ) {}

  async execute(input: AuditReadInput): Promise<void> {
    if (this.featureService.isDisabled("HOOK")) {
      await this.decisionPresenter.allow();
      return;
    }

    const { hook, options } = input;

    const filePath = hook.toolInput.filePath;
    if (!filePath || typeof filePath !== "string") {
      await this.decisionPresenter.allow();
      return;
    }

    if (this.patternMatcher.matches(filePath, options.sensitivePatterns)) {
      await this.decisionPresenter.deny(
        `The file path '${filePath}' is restricted.`,
      );
      return;
    }

    await this.decisionPresenter.allow();
  }
}
