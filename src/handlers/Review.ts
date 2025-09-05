import { container } from "tsyringe";

import { ConsoleReviewPresenter } from "@/presenters/ConsoleReviewPresenter";
import { ReviewCode } from "@/usecases/ReviewCode";

export async function reviewAction(path: string) {
  const presenter = container.resolve(ConsoleReviewPresenter);
  const usecase = new ReviewCode(presenter);
  await usecase.execute({ filePath: path });
}
