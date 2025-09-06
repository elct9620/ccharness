import { Evaluation, EvaluationItem } from "@/entities/Evaluation";
import type { Rubric } from "@/entities/Rubric";
import type { ReviewService } from "@/usecases/interface";
import { injectable } from "tsyringe";

@injectable()
export class TestReviewService implements ReviewService {
  async review(path: string, rubric: Rubric): Promise<Evaluation> {
    const evaluation = new Evaluation(rubric.name);
    evaluation.add(new EvaluationItem(1, 1));
    return evaluation;
  }
}
