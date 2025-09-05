import { inject, injectable } from "tsyringe";

import { IConsole } from "@/token";
import type { ReviewPresenter } from "@/usecases/interface";

@injectable()
export class ConsoleReviewPresenter implements ReviewPresenter {
  constructor(@inject(IConsole) private readonly console: Console) {}

  async pass(): Promise<void> {
    this.console.log("Score: 1/1");
  }
}
