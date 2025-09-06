import { Evaluation } from "@/entities/Evaluation";
import type { Rubric } from "@/entities/Rubric";
import type { ReviewService } from "@/usecases/interface";
import { injectable } from "tsyringe";

@injectable()
export class ClaudeReviewService implements ReviewService {
  async review(path: string, rubric: Rubric): Promise<Evaluation> {
    return new Evaluation(rubric.name, 1, 1);
  }
}
