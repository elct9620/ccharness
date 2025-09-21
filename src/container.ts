import { container } from "tsyringe";

import { ConsolePreToolUseDecisionPresenter } from "./presenters/ConsolePreToolUseDecisionPresenter";
import { ClaudeReviewService } from "./services/ClaudeReviewService";
import { EnvFeatureService } from "./services/EnvFeatureService";
import { GlobPatternMatcher } from "./services/GlobPatternMatcher";
import { JsonConfigService } from "./services/JsonConfigService";
import {
  IConfigService,
  IConsole,
  IHookInputStream,
  IProjectRoot,
} from "./token";
import {
  IFeatureService,
  IPatternMatcher,
  IPreToolUseDecisionPresenter,
  IReviewService,
} from "./usecases/interface";

container.register(IProjectRoot, {
  useFactory: () => process.env.CLAUDE_PROJECT_DIR || process.cwd(),
});

container.register(IHookInputStream, {
  useFactory: () => process.stdin,
});

container.register(IConsole, { useValue: console });
container.register(IConfigService, {
  useClass: JsonConfigService,
});
container.register(IReviewService, {
  useClass: ClaudeReviewService,
});
container.register(IPatternMatcher, {
  useClass: GlobPatternMatcher,
});
container.register(IPreToolUseDecisionPresenter, {
  useClass: ConsolePreToolUseDecisionPresenter,
});
container.register(IFeatureService, {
  useClass: EnvFeatureService,
});
