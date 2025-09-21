import type {
  FeatureService,
  PostToolUseDecisionPresenter,
  RubricRepository,
} from "./interface";

export type RemindToReviewInput = {
  filePath: string;
  blockMode?: boolean;
};

export class RemindToReview {
  constructor(
    private readonly featureService: FeatureService,
    private readonly rubrics: RubricRepository,
    private readonly presenter: PostToolUseDecisionPresenter,
  ) {}

  async execute(input: RemindToReviewInput): Promise<void> {
    if (this.featureService.isDisabled("HOOK")) {
      return;
    }

    const matchedRubrics = await this.rubrics.matches(input.filePath);
    if (matchedRubrics.length === 0) {
      await this.presenter.pass();
      return;
    }

    const rubricPathReferences = matchedRubrics
      .map((r) => `@${r.path}`)
      .join(", ");

    const reviewMessage = `Ensure review changes against ${rubricPathReferences}, fix rubrics violations and keep the code clean before proceeding.`;

    if (input.blockMode) {
      await this.presenter.block(reviewMessage);
    } else {
      await this.presenter.pass(reviewMessage);
    }
  }
}
