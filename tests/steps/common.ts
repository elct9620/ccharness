import { container } from "tsyringe";

import type { ConfigSchema } from "@/constant";
import { JsonConfigService } from "@/services/JsonConfigService";
import { IConfigService } from "@/token";
import { vi } from "vitest";

export async function givenConfig(config: ConfigSchema) {
  const jsonConfig = container.resolve(JsonConfigService);

  const spy = vi.spyOn(jsonConfig, "load").mockImplementation(async () => {
    return config;
  });
  container.register(IConfigService, {
    useValue: jsonConfig,
  });

  return spy;
}
