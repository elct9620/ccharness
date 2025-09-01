import { container } from "tsyringe";

export const IProjectRoot = Symbol("IProjectRoot");
container.register(IProjectRoot, {
  useFactory: () => process.env.CLAUDE_PROJECT_DIR || process.cwd(),
});

export const IHookInputStream = Symbol("IHookInputStream");
container.register(IHookInputStream, {
  useFactory: () => process.stdin,
});

export const IConsole = Symbol("IConsole");
container.register(IConsole, { useValue: console });
