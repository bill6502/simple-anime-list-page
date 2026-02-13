// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import { errorMessages } from '$lib/type.ts';
import { updateMyAnimeList } from '../../lib/utility.ts';
import db from '$lib/db';

export const load: PageLoad = async ({ url, params, fetch }) => {
  if (!browser) {
    return { animes: [], userName: '' };
  }

  if (store.fetch == undefined) {
    store.fetch = fetch;
  }

  const error = url.searchParams.get('error');
  if (error && error in errorMessages) {
    store.errorMessage = errorMessages[error];
  }

  const { id } = params;
  const host = url.searchParams.get('from') ?? url.pathname;

  if (store.user && store.userAnimeListId == id) {
    await updateMyAnimeList();
    return {
      animes: store.userAnimeList,
      userName: store.user.username,
      isMyAnimeList: true,
    };
  }

  const checkResponse = await db.checkWebsiteInfoBy_Id(id);

  if (!checkResponse.ok) {
    throw redirect(302, `${host}?error=not_response`);
  }

  const check = await checkResponse.json();
  const isExists = check.value as boolean;
  if (!isExists) {
    throw redirect(302, `${host}?error=not_found`);
  }

  const response = await db.getWebsiteInfoBy_Id(id);

  if (!response.ok) {
    throw redirect(302, `${host}?error=not_response`);
  }

  const data = await response.json();

  return {
    animes: data.value.animes,
    userName: data.value.userName,
    isMyAnimeList: false,
  };
};
