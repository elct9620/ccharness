#!/usr/bin/env node

import { Command } from "commander";

import { commitAction } from "@/handlers/hook/commit";

const program = new Command();

program
  .name("ccharness")
  .description("A lightweight harness for Claude Code")
  .version("0.1.0");

const hook = program.command("hook").description("The hooks for Claude Code");
hook
  .command("commit")
  .description(
    "Ensure the agent commit frequently according to the throttle limit",
  )
  .action(commitAction);

await program.parseAsync(process.argv);
