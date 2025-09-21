import { afterEach, describe, it, vi } from "vitest";

import {
  givenEnvironmentVariable,
  thenFeatureShouldBeDisabled,
  thenFeatureShouldBeEnabled,
} from "tests/steps/common";

describe("EnvFeatureService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("when environment variable is set to '1'", () => {
    it("is expected to return true for the corresponding feature", () => {
      givenEnvironmentVariable("CCHARNESS_FEATURE_DISABLED", "1");

      thenFeatureShouldBeDisabled("FEATURE");
      thenFeatureShouldBeEnabled("HOOK");
    });
  });

  describe("when environment variable is set to 'true'", () => {
    it("is expected to return true for the corresponding feature", () => {
      givenEnvironmentVariable("CCHARNESS_FEATURE_DISABLED", "true");

      thenFeatureShouldBeDisabled("FEATURE");
      thenFeatureShouldBeEnabled("HOOK");
    });
  });

  describe("when no environment variables are set", () => {
    it("is expected to return false for all features", () => {
      thenFeatureShouldBeEnabled("HOOK");
      thenFeatureShouldBeEnabled("FEATURE");
    });
  });

  describe("when feature name contains lowercase letters", () => {
    it("is expected to convert to uppercase for environment variable lookup", () => {
      givenEnvironmentVariable("CCHARNESS_HOOK_DISABLED", "1");

      thenFeatureShouldBeDisabled("hook");
    });
  });
});
