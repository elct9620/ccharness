import { inject, injectable } from "tsyringe";

import { Rubric } from "@/entities/Rubric";
import { JsonConfigService } from "@/services/JsonConfigService";
import type { RubricRepository } from "@/usecases/interface";

@injectable()
export class JsonRubricRepository implements RubricRepository {
  constructor(
    @inject(JsonConfigService) private configService: JsonConfigService,
  ) {}

  async matches(path: string): Promise<Rubric[]> {
    const config = await this.configService.load();
    const rubrics = config.rubrics.map((rubic) => {
      const regex = new RegExp(rubic.pattern);
      return new Rubric(rubic.name, regex, rubic.path);
    });

    return rubrics.filter((rubic) => rubic.isMatch(path));
  }
}
