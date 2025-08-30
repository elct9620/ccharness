import { WorkingState } from "@/entities/WorkingState";
import type { WorkingStateBuilder } from "@/usecases/interface";

export class JsonWorkingStateBuilder implements WorkingStateBuilder {
  private maxFiles: number | null = null;
  private maxLines: number | null = null;

  private changedFiles: number = 0;
  private changedLines: number = 0;
  private untrackedLines: number = 0;

  constructor() {}

  withMaxFiles(maxFiles: number): WorkingStateBuilder {
    this.maxFiles = maxFiles;
    return this;
  }

  withMaxLines(maxLines: number): WorkingStateBuilder {
    this.maxLines = maxLines;
    return this;
  }

  withChangedFiles(changedFiles: number): WorkingStateBuilder {
    this.changedFiles = changedFiles;
    return this;
  }

  withChangedLines(changedLines: number): WorkingStateBuilder {
    this.changedLines = changedLines;
    return this;
  }

  withUntrackedLines(untrackedLines: number): WorkingStateBuilder {
    this.untrackedLines = untrackedLines;
    return this;
  }

  async build() {
    return new WorkingState(
      this.maxFiles ?? -1,
      this.maxLines ?? -1,
      this.changedFiles,
      this.changedLines,
      this.untrackedLines,
    );
  }
}
