import { inject, injectable } from "tsyringe";

import { type ConfigSchema } from "@/constant";
import { WorkingState } from "@/entities/WorkingState";
import { IConfigService } from "@/token";
import type { WorkingStateBuilder } from "@/usecases/interface";
import type { ConfigService } from "./interface";

@injectable()
export class JsonWorkingStateBuilder implements WorkingStateBuilder {
  private maxFiles: number | null = null;
  private maxLines: number | null = null;

  private changedFiles: number = 0;
  private changedLines: number = 0;
  private untrackedLines: number = 0;

  private isLoadedFromConfig = false;

  constructor(@inject(IConfigService) private configService: ConfigService) {}

  useConfigFile(): WorkingStateBuilder {
    this.isLoadedFromConfig = true;
    return this;
  }

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
    if (this.isLoadedFromConfig) {
      const config: ConfigSchema = await this.configService.load();
      if (this.maxFiles === null || this.maxFiles < 0) {
        this.maxFiles = config.commit.maxFiles;
      }
      if (this.maxLines === null || this.maxLines < 0) {
        this.maxLines = config.commit.maxLines;
      }
    }

    return new WorkingState(
      this.maxFiles ?? -1,
      this.maxLines ?? -1,
      this.changedFiles,
      this.changedLines,
      this.untrackedLines,
    );
  }
}
