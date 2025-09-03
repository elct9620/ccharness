import { CmdGitService } from "@/services/CmdGitService";
import { container } from "tsyringe";

export async function givenGitService(gitService: any) {
  container.register(CmdGitService, { useValue: gitService });
}
