import "@abraham/reflection";

import { Readable, Writable } from "stream";
import { container } from "tsyringe";
import { beforeEach, vi } from "vitest";

import "@/container";
import { IConfigService, IConsole, IHookInputStream } from "@/token";
import { TestConsole } from "./support/TestConsole";

beforeEach(() => {
  container.clearInstances();

  container.register(IHookInputStream, {
    useValue: Readable.from("{}"),
  });

  const output = new Writable();
  container.register(IConsole, {
    useValue: new TestConsole(),
  });

  // Register default empty config to prevent real file loading
  const defaultMockedConfigService = {
    load: vi.fn().mockResolvedValue({
      commit: { maxFiles: 10, maxLines: 500 },
      rubrics: [],
    }),
  };
  container.register(IConfigService, {
    useValue: defaultMockedConfigService,
  });
});
