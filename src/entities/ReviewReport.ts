import type { Evaluation } from "./Evaluation";

export class ReviewReport {
  private _evaluations: Evaluation[] = [];

  get evaluations(): Evaluation[] {
    return [...this._evaluations];
  }

  get isEmpty(): boolean {
    return this._evaluations.length === 0;
  }

  addEvaluation(evaluation: Evaluation): void {
    this._evaluations.push(evaluation);
  }
}
