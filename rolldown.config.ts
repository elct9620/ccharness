import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'dist/index.js',
  },
  platform: 'node',
  tsconfig: 'tsconfig.json',
});
