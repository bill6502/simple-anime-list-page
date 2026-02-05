import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import db from '$lib/db.ts';

export const load: PageLoad = async ({ url }) => {
  if (url.href.includes('#')) {
    throw redirect(307, url.href.replace('#', '?'));
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

  let listId = store.userAnimeListId;
  if (user) {
    const updateAnimesList = await db.updateWebsiteInfo(user.id, user.username);

    if (!updateAnimesList.ok) {
      console.error('Failed to update animes list');
      return { error: 'failed_to_update_animes_list', user: null, listId: '' };
    }
    const listIdJson = await updateAnimesList.json();
    localStorage.setItem('userAnimeListId', JSON.stringify(listIdJson));

    if (listIdJson.value) {
      listId = listIdJson.value;
    }
    store.userAnimeListId = listIdJson.value;
  }

  store.user = user;
  store.userAnimeListId = listId;

  const error = url.searchParams.get('error');
  if (!error) {
    return { error: '', user, listId };
  }
  return { error, user, listId };
};
