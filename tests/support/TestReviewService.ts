import { Evaluation, EvaluationItem } from "@/entities/Evaluation";
import type { Rubric } from "@/entities/Rubric";
import type { ReviewService } from "@/usecases/interface";
import { injectable } from "tsyringe";

export type EvaluationItemData = {
  score: number;
  total: number;
  comment?: string;
};

export type EvaluationData = {
  name: string;
  items: EvaluationItemData[];
};

@injectable()
export class TestReviewService implements ReviewService {
  private evaluationDataMap = new Map<string, EvaluationItemData[]>();

  setEvaluationData(evaluations: EvaluationData[]): void {
    this.evaluationDataMap.clear();
    for (const evaluation of evaluations) {
      this.evaluationDataMap.set(evaluation.name, evaluation.items);
    }
  }

  async review(path: string, rubric: Rubric): Promise<Evaluation> {
    const evaluation = new Evaluation(rubric.name);
    const itemsData = this.evaluationDataMap.get(rubric.name) || [
      { score: 1, total: 1 },
    ];

    for (const itemData of itemsData) {
      evaluation.add(
        new EvaluationItem(itemData.score, itemData.total, itemData.comment),
      );
    }

    return evaluation;
  }
}
