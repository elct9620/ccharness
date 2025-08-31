import type { HookInput } from "@/usecases/port";
import { injectable } from "tsyringe";

@injectable()
export class StdinHookService {
  async parse<T extends HookInput>(): Promise<T> {
    return new Promise((resolve, reject) => {
      let input = "";
      process.stdin.setEncoding("utf-8");
      process.stdin.on("data", (chunk) => {
        input += chunk;
      });
      process.stdin.on("end", () => {
        try {
          const data = JSON.parse(input);
          resolve(this.convertSnakeToCamel(data) as T);
        } catch (error) {
          reject(error);
        }
      });

      process.stdin.on("error", (error) => {
        reject(error);
      });
    });
  }

  private convertSnakeToCamel(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.convertSnakeToCamel(item));
    } else if (data !== null && typeof data === "object") {
      const newObj: any = {};
      for (const key in data) {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1]!.toUpperCase());
        newObj[camelKey] = this.convertSnakeToCamel(data[key]);
      }
      return newObj;
    }
    return data;
  }
}
