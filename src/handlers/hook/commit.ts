import { ConsoleStopDecisionPresenter } from "@/presenters/ConsoleStopDecisionPresenter";
import { CmdGitService } from "@/services/CmdGitService";
import { JsonCommitConfigBuilder } from "@/services/CommitConfigBuilder";
import { StdinHookService } from "@/services/StdinHookService";
import { CommitReminder } from "@/usecases/CommitReminder";
import { container } from "tsyringe";

type CommitOptions = {
  maxFiles: string;
  maxLines: string;
};

export async function commitAction(options: CommitOptions) {
  const stdinHookService = container.resolve(StdinHookService);
  const gitService = container.resolve(CmdGitService);
  const configBuilder = container.resolve(JsonCommitConfigBuilder);
  const decisionPresenter = container.resolve(ConsoleStopDecisionPresenter);

  const hook = await stdinHookService.parse();

  const commitReminder = new CommitReminder(
    gitService,
    configBuilder,
    decisionPresenter,
  );
  await commitReminder.execute({
    hook,
    options: {
      maxFiles: parseInt(options.maxFiles, 10),
      maxLines: parseInt(options.maxLines, 10),
    },
  });
}
