import { inject, injectable } from "tsyringe";

import { IConsole } from "@/token";

@injectable()
export class ConsoleReviewPresenter {
  constructor(@inject(IConsole) private readonly console: Console) {}

  pass(): void {
    this.console.log("Score: 1/1");
  }
}
