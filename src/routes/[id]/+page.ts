// deno-lint-ignore-file  no-sloppy-imports
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import { errorMessage } from '$lib/type.ts';
import { discordAuth, updateMyAnimeList } from '../../lib/utility.ts';
import db from '$lib/db';

export const load: PageLoad = async ({ url, params, fetch }) => {
  if (!browser) {
    return { animes: [], userName: '' };
  }

  if (store.fetch == undefined) {
    store.fetch = fetch;
  }

  if (!store.user && store.access_token) {
    await discordAuth(store.access_token);
  }

  store.message = '載入中...';

  const { id } = params;
  const host = url.searchParams.get('from') ?? url.pathname;

  if (store.user && store.userAnimeListId == id) {
    await updateMyAnimeList();
    store.message = '';

    store.message = '載入完成!';
    return {
      animes: store.userAnimeList,
      userName: store.user.username,
    };
  }

  const checkResponse = await db.checkWebsiteInfoBy_Id(id);

  if (!checkResponse.ok) {
    store.message = errorMessage.not_response;
    throw redirect(302, host);
  }

  const check = await checkResponse.json();
  const isExists = check as boolean;
  if (!isExists) {
    store.message = errorMessage.not_found;
    throw redirect(302, host);
  }

  const response = await db.getWebsiteInfoBy_Id(id);

  if (!response.ok) {
    store.message = errorMessage.not_response;
    throw redirect(302, host);
  }

  const data = await response.json();

  store.message = '載入完成!';
  return {
    animes: data.animes,
    userName: data.userName,
  };
};
