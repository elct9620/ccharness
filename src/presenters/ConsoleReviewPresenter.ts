import { inject, injectable } from "tsyringe";

import type { ReviewReport } from "@/entities/ReviewReport";
import { IConsole } from "@/token";
import type { ReviewPresenter } from "@/usecases/interface";

@injectable()
export class ConsoleReviewPresenter implements ReviewPresenter {
  constructor(@inject(IConsole) private readonly console: Console) {}

  async display(report: ReviewReport): Promise<void> {
    const evaluation = report.evaluations[0];
    if (!evaluation) {
      this.console.log("No evaluations available");
      return;
    }

    const percentage = Math.round(evaluation.passRate);
    this.console.log(
      `${evaluation.name}: ${evaluation.score}/${evaluation.total} (${percentage}%)`,
    );
  }
}
