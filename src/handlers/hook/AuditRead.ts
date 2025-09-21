import { container } from "tsyringe";

import { JsonConfigService } from "@/services/JsonConfigService";
import { ReadHookInputService } from "@/services/ReadHookInputService";
import { IConfigService } from "@/token";
import { AuditRead } from "@/usecases/AuditRead";
import type {
  PatternMatcher,
  PreToolUseDecisionPresenter,
} from "@/usecases/interface";
import {
  IPatternMatcher,
  IPreToolUseDecisionPresenter,
} from "@/usecases/interface";
import type { PreToolUseHookInput } from "@/usecases/port";

export async function auditReadAction() {
  const decisionPresenter = container.resolve<PreToolUseDecisionPresenter>(
    IPreToolUseDecisionPresenter,
  );

  if (
    process.env.CCHARNESS_HOOK_DISABLED === "true" ||
    process.env.CCHARNESS_HOOK_DISABLED === "1"
  ) {
    await decisionPresenter.allow();
    return;
  }

  const readHookInputService = container.resolve(ReadHookInputService);
  const configService = container.resolve<JsonConfigService>(IConfigService);
  const patternMatcher = container.resolve<PatternMatcher>(IPatternMatcher);

  const hook = await readHookInputService.parse<PreToolUseHookInput>();
  const config = await configService.load();

  const auditRead = new AuditRead(patternMatcher, decisionPresenter);
  await auditRead.execute({
    hook,
    options: {
      sensitivePatterns: config.audit?.read || [],
    },
  });
}
