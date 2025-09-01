import { inject, injectable } from "tsyringe";

import { IConsole } from "@/container";
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

  async allow(context?: string): Promise<void> {
    this.render({
      reason: "",
      hookSpecificOutput: {
        additionalContext: context,
      },
    });
  }

  async block(reason: string, context?: string): Promise<void> {
    this.render({
      reason,
      hookSpecificOutput: {
        additionalContext: context,
      },
    });
  }
}
