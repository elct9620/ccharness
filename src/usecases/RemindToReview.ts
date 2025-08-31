import type { RubricRepository } from "./interface";

export type RemindToReviewInput = {
  filePath: string;
};

export class RemindToReview {
  constructor(private readonly rubrics: RubricRepository) {}

  async execute(input: RemindToReviewInput): Promise<void> {
    const matchedRubrics = await this.rubrics.matches(input.filePath);
    if (matchedRubrics.length === 0) {
      return;
    }

    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          additionalContext: `The modified file should be reviewed according to the following rubrics: ${matchedRubrics.map((r) => `@${r.path}`).join(", ")}`,
        },
      }),
    );
  }
}
