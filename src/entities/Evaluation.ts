import { Criteria } from "./Criteria";

export class Evaluation {
  private readonly _items: Criteria[] = [];

  constructor(public readonly name: string) {}

  add(item: Criteria): void {
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

  get items(): Criteria[] {
    return [...this._items];
  }
}
