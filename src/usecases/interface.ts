import type { WorkingState } from "@/entities/WorkingState";

export const IGitService = Symbol("IGitService");
export interface GitService {
  isAvailable(): Promise<boolean>;
  countChangedFiles(): Promise<number>;
  countChangedLines(): Promise<number>;
  countUntrackedLines(): Promise<number>;
}

export const IWorkingStateBuilder = Symbol("IWorkingStateBuilder");
export interface WorkingStateBuilder {
  build(): Promise<WorkingState>;
  withMaxFiles(maxFiles: number): WorkingStateBuilder;
  withMaxLines(maxLines: number): WorkingStateBuilder;
  withChangedFiles(changedFiles: number): WorkingStateBuilder;
  withChangedLines(changedLines: number): WorkingStateBuilder;
  withUntrackedLines(untrackedLines: number): WorkingStateBuilder;
}

export const IStopDicisionPresenter = Symbol("IStopDicisionPresenter");
export interface StopDecisionPresenter {
  allow(reason?: string): Promise<void>;
  block(reason: string): Promise<void>;
}
