// deno-lint-ignore-file  no-sloppy-imports

import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import { urls, errorString, type Anime } from '$lib/type.ts';
import { discordAuth, updateMyAnimeList } from '../lib/utility.ts';
import db from '$lib/db.ts';

export const load: PageLoad = async ({ url, fetch }) => {
  if (store.fetch == undefined) {
    store.fetch = fetch;
  }

  if (url.href.includes('#')) {
    throw redirect(302, url.href.replace('#', '?'));
  }

  const error = url.searchParams.get('error');
  if (error && error in errorString) {
    store.message = errorString[error];
  }

  const access_token = url.searchParams.get('access_token') ?? '';
  if (access_token) {
    await discordAuth(access_token);
  }

  if (!store.user && !access_token && store.access_token) {
    await discordAuth(store.access_token);
  }

  store.message = '載入中...';

  const getAllAnimes = await db.getAllAnimes();
  let animes: Anime[] = [];
  if (getAllAnimes.ok) {
    const animesJson = await getAllAnimes.json();

    animesJson.map((anime: Anime) => {
      let from = '';
      for (const url of urls) {
        if (anime.url.includes('https://' + url)) {
          from = url.replace('.', '');
        }
      }
      animes.push({ name: anime.name, url: anime.url, from } as Anime);
    });

    animes = animes.sort((a, b) => a.url.localeCompare(b.url));
  }

  if (store.user) {
    await updateMyAnimeList();
  }

  if (store.lastPath != '') {
    const lastPath = store.lastPath;

    store.lastPath = '';
    store.message = '';

    throw redirect(302, lastPath);
  }

  return {
    animes,
  };
};
