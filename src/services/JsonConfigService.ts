import { readFile } from "fs/promises";
import { inject, injectable } from "tsyringe";

import {
  CONFIG_FILE_NAME,
  LOCAL_CONFIG_FILE_NAME,
  type ConfigSchema,
} from "@/constant";
import { IProjectRoot } from "@/token";

const defaultConfig: ConfigSchema = {
  commit: {
    maxFiles: -1,
    maxLines: -1,
  },
  review: {
    blockMode: false,
  },
  rubrics: [],
};

@injectable()
export class JsonConfigService {
  private _cache: ConfigSchema | null = null;

  constructor(@inject(IProjectRoot) private readonly rootDir: string) {}

  get configFilePath(): string {
    return `${this.rootDir}/${CONFIG_FILE_NAME}`;
  }

  get localConfigFilePath(): string {
    return `${this.rootDir}/${LOCAL_CONFIG_FILE_NAME}`;
  }

  async load(): Promise<ConfigSchema> {
    if (this._cache) {
      return this._cache;
    }

    let result = { ...defaultConfig };

    try {
      const globalContent = await readFile(this.configFilePath, "utf-8");
      const globalConfig: ConfigSchema = JSON.parse(globalContent);
      result = this.deepMerge(result, globalConfig);
    } catch {
      // Global config file missing or invalid, continue with defaults
    }

    try {
      const localContent = await readFile(this.localConfigFilePath, "utf-8");
      const localConfig: ConfigSchema = JSON.parse(localContent);
      result = this.deepMerge(result, localConfig);
    } catch {
      // Local config file missing or invalid, continue with current result
    }

    this._cache = result;
    return this._cache;
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
