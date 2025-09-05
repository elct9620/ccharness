import { Evaluation } from "@/entities/Evaluation";
import { ReviewReport } from "@/entities/ReviewReport";

import type { ReviewPresenter } from "./interface";

export type ReviewCodeInput = {
  filePath: string;
};

export class ReviewCode {
  constructor(private readonly reviewPresenter: ReviewPresenter) {}

  async execute(input: ReviewCodeInput): Promise<void> {
    const report = new ReviewReport();
    const evaluation = new Evaluation("Test Quality", 2, 5);
    report.addEvaluation(evaluation);

    await this.reviewPresenter.display(report);
  }
}
