export type RemindToReviewInput = {
  filePath: string;
};

export class RemindToReview {
  async execute(input: RemindToReviewInput): Promise<void> {}
}
