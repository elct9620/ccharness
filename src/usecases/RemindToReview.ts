import type {
  PostToolUseDecisionPresenter,
  RubricRepository,
} from "./interface";

export type RemindToReviewInput = {
  filePath: string;
  blockEdit?: boolean;
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

    const reviewMessage = `Ensure review changes against ${rubricPathReferences}, fix rubrics violations and keep the code clean before proceeding.`;

    if (input.blockEdit) {
      this.presenter.block(reviewMessage);
    } else {
      this.presenter.allow(reviewMessage);
    }
  }
}
