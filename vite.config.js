import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 导入 path 模块
import { fileURLToPath } from "url"; // Import fileURLToPath

// Get the directory name in an ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 添加 resolve 配置
    alias: {
      // Use the derived __dirname
      "@": path.resolve(__dirname, "./src"), // 设置 @ 指向 src 目录
    },
  },
});
