import { inject, injectable } from "tsyringe";

import { IConsole } from "@/token";
import { type PostToolUseDecisionPresenter } from "@/usecases/interface";
import { ConsoleDecisionPresenter } from "./ConsoleDecisionPresenter";

@injectable()
export class ConsolePostToolUseDecisionPresenter
  extends ConsoleDecisionPresenter
  implements PostToolUseDecisionPresenter
{
  constructor(@inject(IConsole) console: Console) {
    super(console);
  }

  async pass(context?: string): Promise<void> {
    this.render({
      reason: "",
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: context,
      },
    });
  }

  async block(reason: string, context?: string): Promise<void> {
    this.render({
      decision: "block",
      reason,
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: context,
      },
    });
  }
}
