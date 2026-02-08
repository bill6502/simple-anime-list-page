import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import { urls, type Anime } from '$lib/types.ts';
import db from '$lib/db.ts';

export const load: PageLoad = async ({ url, fetch }) => {
  if (store.fetch == undefined) {
    store.fetch = fetch;
  }

  if (url.href.includes('#')) {
    throw redirect(302, url.href.replace('#', '?'));
  }

  const token_type = url.searchParams.get('token_type') ?? '';
  const access_token = url.searchParams.get('access_token') ?? '';

  let user = store.user;
  if (!user && token_type && access_token) {
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const userJson = await response.json();
    if (userJson) {
      localStorage.setItem('user', JSON.stringify(userJson));
      user = userJson;
    }
  }

  const getAllAnimes = await db.getAllAnimes();
  let animes: Anime[] = [];
  if (getAllAnimes.ok) {
    const animesJson = await getAllAnimes.json();

    animesJson.value.map((anime: any) => {
      animes.push({ name: anime.name, url: anime.url, from: '' } as Anime);
    });

    animes = animes
      .map((anime) => {
        let from = '';
        for (const url of urls) {
          if (anime.url.includes('https://' + url)) {
            from = url.replace('.', '');
          }
        }

        return {
          name: anime.name,
          url: anime.url,
          from: from,
        };
      })
      .sort((a, b) => a.url.localeCompare(b.url));
  }

  let listId = store.userAnimeListId;
  if (user) {
    const updateAnimesList = await db.updateWebsiteInfo(user.id, user.username);

    if (!updateAnimesList.ok) {
      return {
        error: 'failed_to_update_animes_list',
        listId: '',
        animes,
      };
    }
    const listIdJson = await updateAnimesList.json();
    localStorage.setItem('userAnimeListId', listIdJson.value);

    if (listIdJson.value) {
      listId = listIdJson.value;
    }
    store.userAnimeListId = listIdJson.value;
  }

  store.user = user;
  store.userAnimeListId = listId;

  if (store.lastAnimeListId != '') {
    throw redirect(302, `${store.baseUrl}/${store.lastAnimeListId}`);
  }

  const error = url.searchParams.get('error');
  if (!error) {
    return { error: '', listId, animes };
  }
  return { error, listId, animes };
};
