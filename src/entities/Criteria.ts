export class Criteria {
  constructor(
    public readonly name: string,
    public readonly score: number,
    public readonly total: number,
    public readonly comment?: string,
  ) {}

  isSatisfied(): boolean {
    return this.score === this.total;
  }

  withComment(newComment: string): Criteria {
    return new Criteria(this.name, this.score, this.total, newComment);
  }
}
