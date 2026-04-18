import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ficor.cc',
  output: 'static',
  build: {
    format: 'file',
  },
});
