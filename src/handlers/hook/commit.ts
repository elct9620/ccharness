import { CmdGitService } from "@/services/CmdGitService";
import { container } from "tsyringe";

const MAX_CHANGED_FILES = 10;
const MAX_CHANGED_LINES = 500;

export async function commitAction() {
  const gitService = container.resolve(CmdGitService);
  const isGitAvailable = await gitService.isAvailable();
  if (!isGitAvailable) {
    return;
  }

  const changedFiles = await gitService.countChangedFiles();
  const changedLines = await gitService.countChangedLines();
  const untrackedLines = await gitService.countUntrackedLines();

  const hasChanges = changedFiles > 0 || changedLines > 0 || untrackedLines > 0;
  if (!hasChanges) {
    return;
  }

  const hasTooManyChangedFiles = changedFiles > MAX_CHANGED_FILES;
  const hasTooManyChangedLines =
    changedLines + untrackedLines > MAX_CHANGED_LINES;
  const hasTooManyChanges = hasTooManyChangedFiles && hasTooManyChangedLines;

  let reason = "";
  if (hasTooManyChanges) {
    reason = `There are too many changes in the working directory: ${changedFiles} changed files and ${changedLines} changed lines (+${untrackedLines} untracked lines). Please commit your changes before proceeding.`;
  } else if (hasTooManyChangedFiles) {
    reason = `There are too many changed files in the working directory: ${changedFiles} changed files. Please commit your changes before proceeding.`;
  } else if (hasTooManyChangedLines) {
    reason = `There are too many changed lines in the working directory: ${changedLines} changed lines (+${untrackedLines} untracked lines). Please commit your changes before proceeding.`;
  }

  if (reason.length === 0) {
    return;
  }

  console.log(
    JSON.stringify({
      decision: "block",
      reason: reason,
    }),
  );
}
