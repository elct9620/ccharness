export const IGitService = Symbol("IGitService");
export interface GitService {
  isAvailable(): Promise<boolean>;
  countChangedFiles(): Promise<number>;
  countChangedLines(): Promise<number>;
  countUntrackedLines(): Promise<number>;
}
