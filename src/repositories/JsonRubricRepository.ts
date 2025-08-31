import { readFile } from "fs/promises";
import { injectable } from "tsyringe";

import type { ConfigSchema } from "@/constant";
import { Rubric } from "@/entities/Rubric";
import type { RubricRepository } from "@/usecases/interface";

@injectable()
export class JsonRubricRepository implements RubricRepository {
  async matches(path: string): Promise<Rubric[]> {
    const config = await this.readConfig();
    const rubrics = config.rubrics.map((rubic) => {
      const regex = new RegExp(rubic.pattern);
      return new Rubric(rubic.name, regex, rubic.path);
    });

    return rubrics.filter((rubic) => rubic.isMatch(path));
  }

  private async readConfig(): Promise<ConfigSchema> {
    const rootDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const configFilePath = `${rootDir}/ccharness.json`;

    try {
      const fileContent = await readFile(configFilePath, "utf-8");
      return JSON.parse(fileContent) as ConfigSchema;
    } catch {
      return {
        commit: {
          maxFiles: 5,
          maxLines: 500,
        },
        rubrics: [],
      } as ConfigSchema;
    }
  }
}
