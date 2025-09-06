import { container } from "tsyringe";

import { ConsoleReviewPresenter } from "@/presenters/ConsoleReviewPresenter";
import { JsonRubricRepository } from "@/repositories/JsonRubricRepository";
import { ReviewCode } from "@/usecases/ReviewCode";

export async function reviewAction(path: string) {
  const rubricRepository = container.resolve(JsonRubricRepository);
  const presenter = container.resolve(ConsoleReviewPresenter);
  const usecase = new ReviewCode(rubricRepository, presenter);
  await usecase.execute({ filePath: path });
}
