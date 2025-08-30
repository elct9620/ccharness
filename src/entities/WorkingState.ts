export class WorkingState {
  constructor(
    public readonly maxFiles: number,
    public readonly maxLines: number,

    private _changedFiles: number = 0,
    private _changedLines: number = 0,
    private _untrackedLines: number = 0,
  ) {}

  get changedFiles(): number {
    return this._changedFiles;
  }

  get changedLines(): number {
    return this._changedLines;
  }

  get isExceededMaxFiles(): boolean {
    return this.maxFiles >= 0 && this._changedFiles > this.maxFiles;
  }

  get isExceededMaxLines(): boolean {
    return (
      this.maxLines >= 0 &&
      this._changedLines + this._untrackedLines > this.maxLines
    );
  }

  get isExceeded(): boolean {
    return this.isExceededMaxFiles || this.isExceededMaxLines;
  }

  get reason(): string {
    const reasons: string[] = [];
    if (this.isExceededMaxFiles) {
      reasons.push(`${this._changedFiles} changed files`);
    }
    if (this.isExceededMaxLines) {
      reasons.push(
        `${this._changedLines} changed lines (+${this._untrackedLines} untracked lines)`,
      );
    }
    return `There are too many changes in the working directory ${reasons.join(" and ")}. Please review and commit your changes before proceeding.`;
  }
}
