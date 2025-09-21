import { container } from "tsyringe";

import { EnvFeatureService } from "@/services/EnvFeatureService";
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
  const readHookInputService = container.resolve(ReadHookInputService);
  const featureService = container.resolve(EnvFeatureService);
  const configService = container.resolve<JsonConfigService>(IConfigService);
  const patternMatcher = container.resolve<PatternMatcher>(IPatternMatcher);
  const decisionPresenter = container.resolve<PreToolUseDecisionPresenter>(
    IPreToolUseDecisionPresenter,
  );

  const hook = await readHookInputService.parse<PreToolUseHookInput>();
  const config = await configService.load();

  const auditRead = new AuditRead(
    featureService,
    patternMatcher,
    decisionPresenter,
  );
  await auditRead.execute({
    hook,
    options: {
      sensitivePatterns: config.audit?.read || [],
    },
  });
}
