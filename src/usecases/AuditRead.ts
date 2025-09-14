import type { ConfigSchema } from "@/constant";
import type { PatternMatcher, PreToolUseDecisionPresenter } from "./interface";
import type { PreToolUseHookInput } from "./port";

export type AuditReadInput = {
  hook: PreToolUseHookInput;
  config: ConfigSchema;
};

export class AuditRead {
  constructor(
    private readonly patternMatcher: PatternMatcher,
    private readonly decisionPresenter: PreToolUseDecisionPresenter,
  ) {}

  async execute(input: AuditReadInput): Promise<void> {
    const { hook, config } = input;

    const filePath = hook.toolInput.filePath;
    if (!filePath || typeof filePath !== "string") {
      await this.decisionPresenter.allow();
      return;
    }

    const sensitivePatterns = config.audit?.read || [];

    if (this.patternMatcher.matches(filePath, sensitivePatterns)) {
      await this.decisionPresenter.deny(
        `The file path '${filePath}' is restricted.`,
      );
      return;
    }

    await this.decisionPresenter.allow();
  }
}
