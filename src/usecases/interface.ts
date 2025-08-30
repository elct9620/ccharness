import type { CommitConfig } from "@/entities/CommitConfig";

export const IGitService = Symbol("IGitService");
export interface GitService {
  isAvailable(): Promise<boolean>;
  countChangedFiles(): Promise<number>;
  countChangedLines(): Promise<number>;
  countUntrackedLines(): Promise<number>;
}

export const ICommitConfigBuilder = Symbol("ICommitConfigBuilder");
export interface CommitConfigBuilder {
  build(): Promise<CommitConfig>;
  withMaxFiles(maxFiles: number): CommitConfigBuilder;
  withMaxLines(maxLines: number): CommitConfigBuilder;
}

export const IStopDicisionPresenter = Symbol("IStopDicisionPresenter");
export interface StopDecisionPresenter {
  allow(reason?: string): Promise<void>;
  block(reason: string): Promise<void>;
}
