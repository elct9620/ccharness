export const CONFIG_FILE_NAME = "ccharness.json";

export type ConfigSchema = {
  commit: {
    maxFiles: number;
    maxLines: number;
  };
  rubrics: {
    name: string;
    pattern: string;
    path: string;
  }[];
};
