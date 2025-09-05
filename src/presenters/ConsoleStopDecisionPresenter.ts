import { inject, injectable } from "tsyringe";

import { IConsole } from "@/token";
import type { StopDecisionPresenter } from "@/usecases/interface";
import { ConsoleDecisionPresenter } from "./ConsoleDecisionPresenter";

@injectable()
export class ConsoleStopDecisionPresenter
  extends ConsoleDecisionPresenter
  implements StopDecisionPresenter
{
  constructor(@inject(IConsole) console: Console) {
    super(console);
  }

  async pass(reason?: string): Promise<void> {
    this.render({
      decision: undefined,
      reason: reason || "",
    });
  }

  async block(reason: string): Promise<void> {
    this.render({
      decision: "block",
      reason: reason,
    });
  }
}
