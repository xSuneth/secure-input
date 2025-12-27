import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SecureInput",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["@secure-input/wasm"],
      output: {
        preserveModules: false,
      },
    },
    minify: "esbuild",
    sourcemap: true,
    target: "es2020",
  },
  worker: {
    format: "es",
    rollupOptions: {
      output: {
        entryFileNames: "workers/[name].js",
      },
    },
  },
});
