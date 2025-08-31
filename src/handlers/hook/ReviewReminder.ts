import { container } from "tsyringe";

import { JsonRubricRepository } from "@/repositories/JsonRubricRepository";
import { StdinHookService } from "@/services/StdinHookService";
import { RemindToReview } from "@/usecases/RemindToReview";
import type { PostToolUseHookInput } from "@/usecases/port";

const ALLOWED_TOOLS = ["Write", "Edit", "MultiEdit"];

export async function reviewReminderAction() {
  const stdinHookService = container.resolve(StdinHookService);
  const rubricRepository = container.resolve(JsonRubricRepository);

  const hook = await stdinHookService.parse<PostToolUseHookInput>();
  if (!ALLOWED_TOOLS.includes(hook.toolName)) {
    return;
  }

  const remindeToReview = new RemindToReview(rubricRepository);
  await remindeToReview.execute({
    filePath: hook.toolResponse.filePath,
  });
}
