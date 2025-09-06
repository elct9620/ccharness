export const CONFIG_FILE_NAME = "ccharness.json";
export const LOCAL_CONFIG_FILE_NAME = "ccharness.local.json";

export type ConfigSchema = {
  claude?: {
    executablePath?: string;
  };
  commit: {
    maxFiles: number;
    maxLines: number;
  };
  review: {
    blockMode: boolean;
  };
  rubrics: {
    name: string;
    pattern: string;
    path: string;
  }[];
};
