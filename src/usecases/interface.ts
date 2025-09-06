import type { Evaluation } from "@/entities/Evaluation";
import type { ReviewReport } from "@/entities/ReviewReport";
import type { Rubric } from "@/entities/Rubric";
import type { WorkingState } from "@/entities/WorkingState";

export const IGitService = Symbol("IGitService");
export interface GitService {
  isAvailable(): Promise<boolean>;
  countChangedFiles(): Promise<number>;
  countChangedLines(): Promise<number>;
  countUntrackedLines(): Promise<number>;
}

export const IReviewService = Symbol("IReviewService");
export interface ReviewService {
  review(path: string, rubric: Rubric, maxRetry?: number): Promise<Evaluation>;
}

export const IWorkingStateBuilder = Symbol("IWorkingStateBuilder");
export interface WorkingStateBuilder {
  build(): Promise<WorkingState>;
  useConfigFile(): WorkingStateBuilder;
  withMaxFiles(maxFiles: number): WorkingStateBuilder;
  withMaxLines(maxLines: number): WorkingStateBuilder;
  withChangedFiles(changedFiles: number): WorkingStateBuilder;
  withChangedLines(changedLines: number): WorkingStateBuilder;
  withUntrackedLines(untrackedLines: number): WorkingStateBuilder;
}

export const IStopDicisionPresenter = Symbol("IStopDicisionPresenter");
export interface StopDecisionPresenter {
  pass(reason?: string): Promise<void>;
  block(reason: string): Promise<void>;
}

export const IPostToolUseDecisionPresenter = Symbol(
  "IPostToolUseDecisionPresenter",
);
export interface PostToolUseDecisionPresenter {
  pass(context?: string): Promise<void>;
  block(reason: string, context?: string): Promise<void>;
}

export const IRubricRepository = Symbol("IRubricRepository");
export interface RubricRepository {
  matches(path: string): Promise<Rubric[]>;
}

export const IReviewPresenter = Symbol("IReviewPresenter");
export interface ReviewPresenter {
  progress(status: string): Promise<void>;
  display(report: ReviewReport): Promise<void>;
}
