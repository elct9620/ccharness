export const CONFIG_FILE_NAME = "ccharness.json";
export const LOCAL_CONFIG_FILE_NAME = "ccharness.local.json";

export type ConfigSchema = {
  claude?: {
    executablePath?: string;
  };
  commit: {
    maxFiles: number;
    maxLines: number;
    reminder?: {
      maxFiles?: number;
      maxLines?: number;
      message?: string;
    };
  };
  review: {
    blockMode: boolean;
  };
  audit?: {
    read?: string[];
  };
  rubrics: {
    name: string;
    pattern: string;
    path: string;
  }[];
};
