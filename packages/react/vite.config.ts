import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SecureInputReact",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "@secure-input/core"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    minify: "esbuild",
    sourcemap: true,
    target: "es2020",
  },
});
