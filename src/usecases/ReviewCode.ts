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

    // Show progress for all rubrics
    for (const rubric of rubrics) {
      await this.reviewPresenter.progress(
        `Review ${input.filePath} with rubric ${rubric.name}`,
      );
    }

    // Execute all reviews in parallel
    const evaluations = await Promise.all(
      rubrics.map((rubric) =>
        this.reviewService.review(input.filePath, rubric, input.maxRetry),
      ),
    );

    // Add all evaluations to the report
    for (const evaluation of evaluations) {
      report.addEvaluation(evaluation);
    }

    await this.reviewPresenter.display(report);
  }
}
