import { inject, injectable } from "tsyringe";

import type { ReviewReport } from "@/entities/ReviewReport";
import { IConsole } from "@/token";
import type { ReviewPresenter } from "@/usecases/interface";

@injectable()
export class ConsoleReviewPresenter implements ReviewPresenter {
  constructor(@inject(IConsole) private readonly console: Console) {}

  async display(report: ReviewReport): Promise<void> {
    if (report.isEmpty) {
      this.console.log("No matching rubrics found for this file");
      return;
    }

    for (const evaluation of report.evaluations) {
      const percentage = Math.round(evaluation.passRate);
      this.console.log(
        `${evaluation.name}: ${evaluation.score}/${evaluation.total} (${percentage}%)`,
      );
    }
  }
}
