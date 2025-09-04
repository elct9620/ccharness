export const CONFIG_FILE_NAME = "ccharness.json";

export type ConfigSchema = {
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
