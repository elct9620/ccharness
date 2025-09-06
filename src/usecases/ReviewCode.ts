import { ReviewReport } from "@/entities/ReviewReport";

import type {
  ReviewPresenter,
  ReviewService,
  RubricRepository,
} from "./interface";

export type ReviewCodeInput = {
  filePath: string;
  maxRetry?: number;
};

export class ReviewCode {
  constructor(
    private readonly rubricRepository: RubricRepository,
    private readonly reviewService: ReviewService,
    private readonly reviewPresenter: ReviewPresenter,
  ) {}

  async execute(input: ReviewCodeInput): Promise<void> {
    const report = new ReviewReport();
    const rubrics = await this.rubricRepository.matches(input.filePath);

    for (const rubric of rubrics) {
      await this.reviewPresenter.progress(
        `Review ${input.filePath} with rubric ${rubric.name}`,
      );
      const evaluation = await this.reviewService.review(
        input.filePath,
        rubric,
        input.maxRetry,
      );
      report.addEvaluation(evaluation);
    }

    await this.reviewPresenter.display(report);
  }
}
