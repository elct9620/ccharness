import { container } from "tsyringe";

import { IConsole, IHookInputStream, IProjectRoot } from "./token";

container.register(IProjectRoot, {
  useFactory: () => process.env.CLAUDE_PROJECT_DIR || process.cwd(),
});

container.register(IHookInputStream, {
  useFactory: () => process.stdin,
});

container.register(IConsole, { useValue: console });
