// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import process from 'node:process';

/** @type {import('@sveltejs/kit').Config} */

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html', // 建議加上，處理路由問題
      precompress: false,
      strict: true,
    }),
    paths: {
      base:
        process.env.NODE_ENV === 'production' ? '/simple-anime-list-page' : '',
    },
  },
};
