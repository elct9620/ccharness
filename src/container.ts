import { container } from "tsyringe";

import { JsonConfigService } from "./services/JsonConfigService";
import {
  IConfigService,
  IConsole,
  IHookInputStream,
  IProjectRoot,
} from "./token";

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
