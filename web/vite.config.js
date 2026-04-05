import { defineConfig } from 'vite';

/**
 * GitHub Pages 项目站点：https://<user>.github.io/<repo>/
 * base 需与仓库名一致，本地开发时 BASE_PATH 未设置则用 '/'
 */
export default defineConfig({
  base: process.env.BASE_PATH || '/',
});
