export class EvaluationItem {
  constructor(
    public readonly score: number,
    public readonly total: number,
    public readonly comment?: string,
  ) {}
}

export class Evaluation {
  private readonly _items: EvaluationItem[] = [];

  constructor(public readonly name: string) {}

  add(item: EvaluationItem): void {
    this._items.push(item);
  }

  get score(): number {
    return this._items.reduce((acc, item) => acc + item.score, 0);
  }

  get total(): number {
    return this._items.reduce((acc, item) => acc + item.total, 0);
  }

  get passRate(): number {
    if (this.total === 0) {
      return 0;
    }

    return (this.score / this.total) * 100;
  }
}
