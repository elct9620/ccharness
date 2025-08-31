import { type PostToolUseDecisionPresenter } from "@/usecases/interface";
import { ConsoleDecisionPresenter } from "./ConsoleDecisionPresenter";

export class ConsolePostToolUseDecisionPresenter
  extends ConsoleDecisionPresenter
  implements PostToolUseDecisionPresenter
{
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
