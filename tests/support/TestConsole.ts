import { Console } from "console";
import { Writable } from "stream";

class StringWritable extends Writable {
  private buffer: string = "";

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ) {
    this.buffer += chunk.toString();
    callback();
  }

  toString() {
    return this.buffer;
  }
}

export class TestConsole extends Console {
  constructor(
    private readonly output: NodeJS.WritableStream = new StringWritable(),
  ) {
    super(output);
  }

  get outputString(): string {
    return this.output.toString();
  }
}
