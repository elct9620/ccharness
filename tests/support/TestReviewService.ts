import { Criteria } from "@/entities/Criteria";
import { Evaluation } from "@/entities/Evaluation";
import type { ReviewService } from "@/usecases/interface";
import { injectable } from "tsyringe";

export type CriteriaData = {
  name: string;
  score: number;
  total: number;
  comment?: string;
};

export type EvaluationData = {
  name: string;
  items: CriteriaData[];
};

@injectable()
export class TestReviewService implements ReviewService {
  private evaluationDataMap = new Map<string, CriteriaData[]>();
  private failureMap = new Map<string, number>();
  private attemptCountMap = new Map<string, number>();

  setEvaluationData(evaluations: EvaluationData[]): void {
    this.evaluationDataMap.clear();
    for (const evaluation of evaluations) {
      this.evaluationDataMap.set(evaluation.name, evaluation.items);
    }
  }

  setFailureCount(rubricName: string, failureCount: number): void {
    this.failureMap.set(rubricName, failureCount);
    this.attemptCountMap.set(rubricName, 0);
  }

  getAttemptCount(rubricName: string): number {
    return this.attemptCountMap.get(rubricName) || 0;
  }

  async review(
    path: string,
    rubric: Rubric,
    maxRetry: number = 3,
  ): Promise<Evaluation> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetry; attempt++) {
      try {
        const currentAttempts = this.attemptCountMap.get(rubric.name) || 0;
        this.attemptCountMap.set(rubric.name, currentAttempts + 1);

        const failureCount = this.failureMap.get(rubric.name) || 0;
        if (currentAttempts < failureCount) {
          throw new Error(`Simulated failure for ${rubric.name}`);
        }

        const evaluation = new Evaluation(rubric.name);
        const itemsData = this.evaluationDataMap.get(rubric.name) || [
          { name: "Default", score: 1, total: 1 },
        ];

        for (const itemData of itemsData) {
          evaluation.add(
            new Criteria(
              itemData.name,
              itemData.score,
              itemData.total,
              itemData.comment,
            ),
          );
        }

        return evaluation;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetry) {
          // Continue to next attempt
          continue;
        }
      }
    }

    // All retries exhausted, return fallback evaluation
    const evaluation = new Evaluation(rubric.name);
    evaluation.add(new Criteria("Fallback", 0, 0));
    return evaluation;
  }
}
