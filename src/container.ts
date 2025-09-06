import { container } from "tsyringe";

import { ClaudeReviewService } from "./services/ClaudeReviewService";
import { JsonConfigService } from "./services/JsonConfigService";
import {
  IConfigService,
  IConsole,
  IHookInputStream,
  IProjectRoot,
} from "./token";
import { IReviewService } from "./usecases/interface";

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
