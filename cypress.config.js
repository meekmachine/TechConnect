import { defineConfig } from "cypress";
import * as viteConfig from "./vite.config.js"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    dev: 'http://localhost:5173/'
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: viteConfig,
    },
  },
});
