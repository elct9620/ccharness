#!/usr/bin/env node

import "@abraham/reflection";
import { Command } from "commander";

import { commitAction } from "@/handlers/hook/commit";

const program = new Command();

program
  .name("ccharness")
  .description("A lightweight harness for Claude Code")
  .version("0.1.3"); // x-release-please-version

const hook = program.command("hook").description("The hooks for Claude Code");
hook
  .command("commit")
  .option(
    "-f, --max-files <number>",
    "The maximum number of files to trigger a commit reminder, use -1 to disable",
    "-1",
  )
  .option(
    "-l, --max-lines <number>",
    "The maximum number of lines changed to trigger a commit reminder, use -1 to disable",
    "-1",
  )
  .description(
    "Ensure the agent commit frequently according to the throttle limit",
  )
  .action(commitAction);

await program.parseAsync(process.argv);
