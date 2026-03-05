// deno-lint-ignore-file  no-sloppy-imports
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { store } from '$lib/store.svelte';
import { messageType } from '$lib/type.ts';
import {
  discordAuth,
  showMessageAndAction,
  updateMyAnimeList,
} from '../../lib/utility.ts';
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

  console.log(url);
  const { id } = params;
  const from = url.searchParams.get('from');
  const error = url.searchParams.get('error');

  if (!error) {
    showMessageAndAction('載入中...');
  }

  if (store.user && store.userAnimeListId == id) {
    await updateMyAnimeList();

    if (!error) {
      showMessageAndAction('載入完成!');
    }
    return {
      animes: store.userAnimeList,
      userName: store.user.username,
    };
  }

  const checkResponse = await db.checkWebsiteInfoBy_Id(id);

  if (!checkResponse.ok) {
    showMessageAndAction(messageType.not_response);

    if (from) {
      throw redirect(302, `${from}?error=1`);
    }
    throw redirect(302, `${store.baseUrl}/?error=1`);
  }

  const check = await checkResponse.json();
  const isExists = check as boolean;
  if (!isExists) {
    showMessageAndAction(messageType.not_found);

    if (from) {
      throw redirect(302, `${from}?error=1`);
    }
    throw redirect(302, `${store.baseUrl}/?error=1`);
  }

  const response = await db.getWebsiteInfoBy_Id(id);

  if (!response.ok) {
    showMessageAndAction(messageType.not_response);

    if (from) {
      throw redirect(302, `${from}?error=1`);
    }
    throw redirect(302, `${store.baseUrl}/?error=1`);
  }

  const data = await response.json();

  if (!error) {
    showMessageAndAction('載入完成!');
  }
  return {
    animes: data.animes,
    userName: data.userName,
  };
};
