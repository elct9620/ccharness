import { container } from "tsyringe";

import { ConsoleReviewPresenter } from "@/presenters/ConsoleReviewPresenter";
import { JsonRubricRepository } from "@/repositories/JsonRubricRepository";
import { ReviewCode } from "@/usecases/ReviewCode";
import { IReviewService, type ReviewService } from "@/usecases/interface";

export async function reviewAction(
  path: string,
  options: { maxRetry?: string },
) {
  const rubricRepository = container.resolve(JsonRubricRepository);
  const reviewService = container.resolve<ReviewService>(IReviewService);
  const presenter = container.resolve(ConsoleReviewPresenter);
  const usecase = new ReviewCode(rubricRepository, reviewService, presenter);
  const maxRetry = options.maxRetry ? parseInt(options.maxRetry, 10) : 3;
  await usecase.execute({ filePath: path, maxRetry });
}
