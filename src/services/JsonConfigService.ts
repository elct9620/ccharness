import { injectable } from "tsyringe";

import type { ConfigSchema } from "@/constant";
import { readFile } from "fs/promises";

const defaultConfig: ConfigSchema = {
  commit: {
    maxFiles: -1,
    maxLines: -1,
  },
  rubrics: [],
};

@injectable()
export class JsonConfigService {
  private _cache: ConfigSchema | null = null;

  async load(): Promise<ConfigSchema> {
    if (this._cache) {
      return this._cache;
    }

    const rootDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const configFilePath = `${rootDir}/ccharness.json`;

    try {
      const content = await readFile(configFilePath, "utf-8");
      const config: ConfigSchema = JSON.parse(content);

      this._cache = this.deepMerge(defaultConfig, config);

      return this._cache as ConfigSchema;
    } catch {
      return defaultConfig;
    }
  }

  deepMerge(target: any, source: any): any {
    const cloneTarget = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        cloneTarget[key] = this.deepMerge(cloneTarget[key] || {}, source[key]);
      } else {
        cloneTarget[key] = source[key];
      }
    }

    return cloneTarget;
  }
}
