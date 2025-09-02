import { inject, injectable } from "tsyringe";

import { Rubric } from "@/entities/Rubric";
import { IConfigService } from "@/token";
import type { RubricRepository } from "@/usecases/interface";
import type { ConfigService } from "./interface";

@injectable()
export class JsonRubricRepository implements RubricRepository {
  constructor(@inject(IConfigService) private configService: ConfigService) {}

  async matches(path: string): Promise<Rubric[]> {
    const config = await this.configService.load();
    const rubrics = config.rubrics.map((rubic) => {
      const regex = new RegExp(rubic.pattern);
      return new Rubric(rubic.name, regex, rubic.path);
    });

    return rubrics.filter((rubic) => rubic.isMatch(path));
  }
}
