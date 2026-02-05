// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { browser } from '$app/environment';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/db';

export const load: PageLoad = async ({ params }) => {
  if (!browser) {
    return { animes: [], userName: '' };
  }

  const { id } = params;
  const host = `${base}/`;

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
  };
};
