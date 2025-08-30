import { injectable } from "tsyringe";
import { stat } from "fs/promises";
import { exec } from "child_process";

import type { GitService } from "@/usecases/interface";

@injectable()
export class CmdGitService implements GitService {
  public readonly projectRoot: string;

  constructor() {
    if (process.env.CLAUDE_PROJECT_DIR) {
      this.projectRoot = process.env.CLAUDE_PROJECT_DIR;
    } else {
      this.projectRoot = process.cwd();
    }
  }

  async isAvailable(): Promise<boolean> {
    const gitDir = `${this.projectRoot}/.git`;
    try {
      const stats = await stat(gitDir);
      if (!stats.isDirectory()) {
        return false;
      }
    } catch (err) {
      return false;
    }

    return true;
  }

  async countChangedFiles(): Promise<number> {
    try {
      const proceline = await this.execCommand("git status --porcelain");
      if (proceline === "") {
        return 0;
      }
      const lines = proceline.split("\n");
      return lines.length;
    } catch (err) {
      return 0;
    }
  }

  async countChangedLines(): Promise<number> {
    try {
      const diffOutput = await this.execCommand("git diff --numstat");
      if (diffOutput === "") {
        return 0;
      }
      const lines = diffOutput.split("\n");
      let totalChangedLines = 0;
      for (const line of lines) {
        const parts = line.split("\t");
        if (parts.length >= 2) {
          const added = parseInt(parts[0] || "0", 10);
          const deleted = parseInt(parts[1] || "0", 10);
          if (!isNaN(added)) {
            totalChangedLines += added;
          }
          if (!isNaN(deleted)) {
            totalChangedLines += deleted;
          }
        }
      }
      return totalChangedLines;
    } catch (err) {
      return 0;
    }
  }

  async countUntrackedLines(): Promise<number> {
    try {
      const untrackedFilesOutput = await this.execCommand(
        "git ls-files --others --exclude-standard | xargs wc -l",
      );
      if (untrackedFilesOutput === "") {
        return 0;
      }
      const totalLine = untrackedFilesOutput.split("\n").pop();
      if (!totalLine) {
        return 0;
      }
      const parts = totalLine.trim().split(/\s+/);
      if (parts.length < 2) {
        return 0;
      }
      const totalUntrackedLines = parseInt(parts[0] || "0", 10);
      return isNaN(totalUntrackedLines) ? 0 : totalUntrackedLines;
    } catch (err) {
      return 0;
    }
  }

  private async execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.projectRoot }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        if (stderr) {
          reject(new Error(stderr));
          return;
        }
        resolve(stdout.trim());
      });
    });
  }
}
