export const IGitService = Symbol("IGitService");
export interface GitService {
  isAvailable(): Promise<boolean>;
  countChangedFiles(): Promise<number>;
  countChangedLines(): Promise<number>;
  countUntrackedLines(): Promise<number>;
}

export const IStopDicisionPresenter = Symbol("IStopDicisionPresenter");
export interface StopDecisionPresenter {
  allow(reason?: string): Promise<void>;
  block(reason: string): Promise<void>;
}
