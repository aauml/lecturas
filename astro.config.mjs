import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://lecturas-ten.vercel.app',
  integrations: [mdx(), react()],
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
