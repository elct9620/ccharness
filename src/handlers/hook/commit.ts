import { ConsoleStopDecisionPresenter } from "@/presenters/ConsoleStopDecisionPresenter";
import { CmdGitService } from "@/services/CmdGitService";
import { CommitReminder } from "@/usecases/CommitReminder";
import { container } from "tsyringe";

const MAX_CHANGED_FILES = 10;
const MAX_CHANGED_LINES = 500;

export async function commitAction() {
  const gitService = container.resolve(CmdGitService);
  const decisionPresenter = container.resolve(ConsoleStopDecisionPresenter);

  const commitReminder = new CommitReminder(gitService, decisionPresenter);
  await commitReminder.execute();
}
