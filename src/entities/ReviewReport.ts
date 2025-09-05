import type { Evaluation } from "./Evaluation";

export class ReviewReport {
  private _evaluations: Evaluation[] = [];

  get evaluations(): Evaluation[] {
    return [...this._evaluations];
  }

  addEvaluation(evaluation: Evaluation): void {
    this._evaluations.push(evaluation);
  }
}
