import { CommitConfig } from "@/entities/CommitConfig";
import type { CommitConfigBuilder } from "@/usecases/interface";

export class JsonCommitConfigBuilder implements CommitConfigBuilder {
  private maxFiles: number | null = null;
  private maxLines: number | null = null;

  constructor() {}

  withMaxFiles(maxFiles: number): CommitConfigBuilder {
    this.maxFiles = maxFiles;
    return this;
  }

  withMaxLines(maxLines: number): CommitConfigBuilder {
    this.maxLines = maxLines;
    return this;
  }

  async build() {
    return new CommitConfig(this.maxFiles ?? -1, this.maxLines ?? -1);
  }
}
