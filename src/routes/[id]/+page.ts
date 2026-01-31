// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { browser } from '$app/environment';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../../../.svelte-kit/types/src/routes/[id]/$types.d.ts';
import { env } from '$env/dynamic/public';

export const load: PageLoad = async ({ fetch, params }) => {
  if (!browser) {
    return { animes: [], userName: '' };
  }

  const { id } = params;
  const host = `${base}/`;
  const db = env.PUBLIC_DB || '';

  const checkResponse = await fetch(`${db}/checkWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args: { id } }),
  });

  if (!checkResponse.ok) {
    throw redirect(302, `${host}?error=not_response`);
  }

  const check = await checkResponse.json();
  const isExists = check.value as boolean;
  if (!isExists) {
    throw redirect(302, `${host}?error=not_found`);
  }

  const response = await fetch(`${db}/getWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args: { id } }),
  });

  if (!response.ok) {
    throw redirect(302, `${host}?error=not_response`);
  }

  const data = await response.json();

  return {
    animes: data.value.animes,
    userName: data.value.userName,
  };
};
