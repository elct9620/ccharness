import type {
  PostToolUseDecisionPresenter,
  RubricRepository,
} from "./interface";

export type RemindToReviewInput = {
  filePath: string;
};

export class RemindToReview {
  constructor(
    private readonly rubrics: RubricRepository,
    private readonly presenter: PostToolUseDecisionPresenter,
  ) {}

  async execute(input: RemindToReviewInput): Promise<void> {
    const matchedRubrics = await this.rubrics.matches(input.filePath);
    if (matchedRubrics.length === 0) {
      this.presenter.allow();
      return;
    }

    const rubricPathReferences = matchedRubrics
      .map((r) => `@${r.path}`)
      .join(", ");
    this.presenter.allow(
      `Ensure self-review based on the following rubric(s): ${rubricPathReferences}.`,
    );
  }
}
