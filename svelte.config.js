// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

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
      // 如果你的網址是 https://<username>.github.io/<repo-name>/
      // 這裡要填入 /<repo-name>，如果是自定義網域則維持空字串
      base:
        process.env.NODE_ENV === 'production' ? '/simple-anime-list-page' : '',
    },
  },
};
