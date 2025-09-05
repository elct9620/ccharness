export class Evaluation {
  constructor(
    public readonly name: string,
    public readonly score: number,
    public readonly total: number,
  ) {}

  get passRate(): number {
    return (this.score / this.total) * 100;
  }
}
