import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: "ESNext",
    lib: {
      entry: resolve(__dirname, "src/plugin/index.ts"),
      name: "v-json-formatter",
      fileName: "v-json-formatter",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "vuedraggable"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          vuedraggable: "Vuedraggable",
        },
      },
    },
  },
})
