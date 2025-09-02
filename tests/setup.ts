import "@abraham/reflection";

import { Readable, Writable } from "stream";
import { container } from "tsyringe";
import { beforeEach } from "vitest";

import "@/container";
import { IConsole, IHookInputStream } from "@/token";
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
});
