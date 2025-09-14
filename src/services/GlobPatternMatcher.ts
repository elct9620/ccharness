import { injectable } from "tsyringe";

import type { PatternMatcher } from "@/usecases/interface";

@injectable()
export class GlobPatternMatcher implements PatternMatcher {
  matches(filePath: string, patterns: string[]): boolean {
    return patterns.some((pattern) => this.matchPattern(filePath, pattern));
  }

  private matchPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, "\\.")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }
}
