export class Rubric {
  constructor(
    public readonly name: string,
    public readonly pattern: RegExp,
    public readonly path: string,
  ) {}

  isMatch(filePath: string): boolean {
    return this.pattern.test(filePath);
  }
}
