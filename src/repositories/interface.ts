import type { ConfigSchema } from "@/constant";

export interface ConfigService {
  load(): Promise<ConfigSchema>;
}
