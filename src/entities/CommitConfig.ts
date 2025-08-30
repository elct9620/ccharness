export class CommitConfig {
  constructor(
    public readonly maxFiles: number,
    public readonly maxLines: number,
  ) {}

  isExceededMaxFiles(changedFiles: number): boolean {
    if (this.maxFiles < 0) {
      return false;
    }

    return changedFiles >= this.maxFiles;
  }

  isExceededMaxLines(changedLines: number): boolean {
    if (this.maxLines < 0) {
      return false;
    }

    return changedLines >= this.maxLines;
  }
}
