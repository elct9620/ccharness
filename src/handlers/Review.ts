import { container } from "tsyringe";

import { ConsoleReviewPresenter } from "@/presenters/ConsoleReviewPresenter";

export async function reviewAction(path: string) {
  const presenter = container.resolve(ConsoleReviewPresenter);
  presenter.pass();
}
