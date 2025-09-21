import { container } from "tsyringe";

import type { ConfigSchema } from "@/constant";
import { IConfigService } from "@/token";
import { vi } from "vitest";

export async function givenConfig(config: ConfigSchema) {
  const mockedConfigService = {
    load: vi.fn().mockResolvedValue(config),
  };

  container.register(IConfigService, {
    useValue: mockedConfigService,
  });

  return mockedConfigService.load;
}

export function givenEnvironmentVariable(name: string, value: string) {
  vi.stubEnv(name, value);
}
