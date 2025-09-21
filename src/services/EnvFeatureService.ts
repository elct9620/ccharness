import { injectable } from "tsyringe";

import type { FeatureService } from "@/usecases/interface";

@injectable()
export class EnvFeatureService implements FeatureService {
  isDisabled(name: string): boolean {
    const specificFlag = `CCHARNESS_${name.toUpperCase()}_DISABLED`;
    const specificValue = process.env[specificFlag];
    return specificValue === "true" || specificValue === "1";
  }
}
