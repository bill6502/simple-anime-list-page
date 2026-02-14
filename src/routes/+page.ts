import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import { urls, errorMessages, type Anime } from '$lib/type.ts';
import { updateMyAnimeList } from '../lib/utility.ts';
import db from '$lib/db.ts';

export const load: PageLoad = async ({ url, fetch }) => {
  if (store.fetch == undefined) {
    store.fetch = fetch;
  }

  if (url.href.includes('#')) {
    throw redirect(302, url.href.replace('#', '?'));
  }

  const error = url.searchParams.get('error');
  if (error && error in errorMessages) {
    store.message = errorMessages[error];
  }

  const token_type = url.searchParams.get('token_type') ?? '';
  const access_token = url.searchParams.get('access_token') ?? '';

  if (!store.user && token_type && access_token) {
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const userJson = await response.json();
    if (userJson) {
      const { id, username, avatar } = userJson;
      store.user = { id, username, avatar };
    }
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
    localStorage.removeItem('lastPath');
    store.message = '';

    throw redirect(302, lastPath);
  }

  return {
    animes,
  };
};
