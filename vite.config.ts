import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig(({ mode }) => {
  const offline = mode === "offline";
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(offline ? [viteSingleFile({ removeViteModuleLoader: true })] : []),
    ],
    base: offline ? "./" : "/rateena-sound-2/",
    build: offline ? { outDir: "dist-offline" } : {},
  };
});
