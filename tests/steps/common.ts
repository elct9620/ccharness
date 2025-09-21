import { container } from "tsyringe";
import { expect, vi } from "vitest";

import type { ConfigSchema } from "@/constant";
import { EnvFeatureService } from "@/services/EnvFeatureService";
import { IConfigService } from "@/token";

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

export function thenFeatureShouldBeDisabled(featureName: string) {
  const featureService = container.resolve(EnvFeatureService);
  expect(featureService.isDisabled(featureName)).toBe(true);
}

export function thenFeatureShouldBeEnabled(featureName: string) {
  const featureService = container.resolve(EnvFeatureService);
  expect(featureService.isDisabled(featureName)).toBe(false);
}
