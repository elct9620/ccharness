import { injectable } from "tsyringe";

import type { StopDecisionPresenter } from "@/usecases/interface";
import { ConsoleDecisionPresenter } from "./ConsoleDecisionPresenter";

@injectable()
export class ConsoleStopDecisionPresenter
  extends ConsoleDecisionPresenter
  implements StopDecisionPresenter
{
  async allow(reason?: string): Promise<void> {
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
