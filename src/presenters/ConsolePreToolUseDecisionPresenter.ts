import { inject, injectable } from "tsyringe";

import { IConsole } from "@/token";
import { type PreToolUseDecisionPresenter } from "@/usecases/interface";
import { ConsoleDecisionPresenter } from "./ConsoleDecisionPresenter";

@injectable()
export class ConsolePreToolUseDecisionPresenter
  extends ConsoleDecisionPresenter
  implements PreToolUseDecisionPresenter
{
  constructor(@inject(IConsole) console: Console) {
    super(console);
  }

  async allow(): Promise<void> {
    this.render({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
      },
    });
  }

  async deny(reason: string): Promise<void> {
    this.render({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    });
  }
}
