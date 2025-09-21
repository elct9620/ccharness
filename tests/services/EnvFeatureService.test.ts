import { afterEach, describe, expect, it, vi } from "vitest";

import { EnvFeatureService } from "@/services/EnvFeatureService";
import { givenEnvironmentVariable } from "tests/steps/common";

describe("EnvFeatureService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("when specific feature flag is set to '1'", () => {
    it("is expected to return true for that specific feature", () => {
      givenEnvironmentVariable("CCHARNESS_FEATURE_DISABLED", "1");

      const service = new EnvFeatureService();
      expect(service.isDisabled("FEATURE")).toBe(true);
      expect(service.isDisabled("HOOK")).toBe(false);
    });
  });

  describe("when specific feature flag is set to 'true'", () => {
    it("is expected to return true for that specific feature", () => {
      givenEnvironmentVariable("CCHARNESS_FEATURE_DISABLED", "true");

      const service = new EnvFeatureService();
      expect(service.isDisabled("FEATURE")).toBe(true);
      expect(service.isDisabled("HOOK")).toBe(false);
    });
  });

  describe("when no flags are set", () => {
    it("is expected to return false for all features", () => {
      const service = new EnvFeatureService();
      expect(service.isDisabled("HOOK")).toBe(false);
      expect(service.isDisabled("FEATURE")).toBe(false);
    });
  });

  describe("when feature name has lowercase", () => {
    it("is expected to convert to uppercase for env var check", () => {
      givenEnvironmentVariable("CCHARNESS_HOOK_DISABLED", "1");

      const service = new EnvFeatureService();
      expect(service.isDisabled("hook")).toBe(true);
    });
  });
});
