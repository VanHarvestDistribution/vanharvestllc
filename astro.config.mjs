import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.vanharvestllc.com',
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  vite: {
    build: { cssMinify: true }
  }
});
