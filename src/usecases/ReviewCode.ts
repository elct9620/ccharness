import type { ReviewPresenter } from "./interface";

export type ReviewCodeInput = {
  filePath: string;
};

export class ReviewCode {
  constructor(private readonly reviewPresenter: ReviewPresenter) {}

  async execute(input: ReviewCodeInput): Promise<void> {
    await this.reviewPresenter.pass();
  }
}
