import { container } from "tsyringe";

import { ConsolePostToolUseDecisionPresenter } from "@/presenters/ConsolePostToolUseDecisionPresenter";
import { JsonRubricRepository } from "@/repositories/JsonRubricRepository";
import { JsonConfigService } from "@/services/JsonConfigService";
import { ReadHookInputService } from "@/services/ReadHookInputService";
import { IConfigService } from "@/token";
import { RemindToReview } from "@/usecases/RemindToReview";
import type { PostToolUseHookInput } from "@/usecases/port";

const ALLOWED_TOOLS = ["Write", "Edit", "MultiEdit"];

type ReviewReminderOptions = {
  block?: boolean;
};

export async function reviewReminderAction(
  options: ReviewReminderOptions = {},
) {
  const readHookInputService = container.resolve(ReadHookInputService);
  const configService = container.resolve<JsonConfigService>(IConfigService);
  const rubricRepository = container.resolve(JsonRubricRepository);
  const presenter = container.resolve(ConsolePostToolUseDecisionPresenter);

  const hook = await readHookInputService.parse<PostToolUseHookInput>();
  if (!ALLOWED_TOOLS.includes(hook.toolName)) {
    return;
  }

  const config = await configService.load();
  const blockEdit =
    options.block !== undefined
      ? options.block
      : config.review?.blockEdit || false;

  const remindeToReview = new RemindToReview(rubricRepository, presenter);
  await remindeToReview.execute({
    filePath: hook.toolResponse.filePath,
    blockEdit,
  });
}
