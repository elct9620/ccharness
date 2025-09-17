import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/main.ts",
  output: {
    file: "dist/index.js",
  },
  platform: "node",
  tsconfig: "tsconfig.json",
  plugins: [
    codecovRollupPlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "ccharness",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
});
