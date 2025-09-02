import "@abraham/reflection";

import { Readable, Writable } from "stream";
import { container } from "tsyringe";
import { beforeAll } from "vitest";

import { IConsole, IHookInputStream } from "@/container";
import { TestConsole } from "./support/TestConsole";

beforeAll(() => {
  container.clearInstances();

  container.register(IHookInputStream, {
    useValue: Readable.from("{}"),
  });

  const output = new Writable();
  container.register(IConsole, {
    useValue: new TestConsole(),
  });
});
