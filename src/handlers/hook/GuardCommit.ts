import { ConsoleStopDecisionPresenter } from "@/presenters/ConsoleStopDecisionPresenter";
import { CmdGitService } from "@/services/CmdGitService";
import { JsonWorkingStateBuilder } from "@/services/JsonWorkingStateBuilder";
import { StdinHookService } from "@/services/StdinHookService";
import { GuardCommit } from "@/usecases/GuardCommit";
import { container } from "tsyringe";

type GuardCommitOptions = {
  maxFiles: string;
  maxLines: string;
};

export async function guardCommitAction(options: GuardCommitOptions) {
  const stdinHookService = container.resolve(StdinHookService);
  const gitService = container.resolve(CmdGitService);
  const configBuilder = container.resolve(JsonWorkingStateBuilder);
  const decisionPresenter = container.resolve(ConsoleStopDecisionPresenter);

  const hook = await stdinHookService.parse();

  const guardCommit = new GuardCommit(
    gitService,
    configBuilder,
    decisionPresenter,
  );
  await guardCommit.execute({
    hook,
    options: {
      maxFiles: parseInt(options.maxFiles, 10),
      maxLines: parseInt(options.maxLines, 10),
    },
  });
}
