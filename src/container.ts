import { container } from "tsyringe";

export const IProjectRoot = Symbol("IProjectRoot");
container.register(IProjectRoot, {
  useFactory: () => process.env.CLAUDE_PROJECT_DIR || process.cwd(),
});
