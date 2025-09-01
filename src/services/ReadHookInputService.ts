import { IHookInputStream } from "@/container";
import type { HookInput } from "@/usecases/port";
import { inject, injectable } from "tsyringe";

@injectable()
export class ReadHookInputService {
  constructor(
    @inject(IHookInputStream)
    private readonly inputStream: NodeJS.ReadableStream,
  ) {}

  async parse<T extends HookInput>(): Promise<T> {
    return new Promise((resolve, reject) => {
      let input = "";
      this.inputStream.setEncoding("utf-8");
      this.inputStream.on("data", (chunk) => {
        input += chunk;
      });
      this.inputStream.on("end", () => {
        try {
          const data = JSON.parse(input);
          resolve(this.convertSnakeToCamel(data) as T);
        } catch (error) {
          reject(error);
        }
      });

      this.inputStream.on("error", (error) => {
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
