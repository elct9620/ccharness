export class Criteria {
  constructor(
    public readonly name: string,
    public readonly score: number,
    public readonly total: number,
    public readonly comment?: string,
  ) {}
}
