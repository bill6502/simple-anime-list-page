// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
export const trailingSlash = 'always';

import { browser } from '$app/environment';
import type { PageLoad } from '../$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ url, fetch, params }) => {
  if (!browser) {
    return { animes: [], userName: '' };
  }

  const id = params.id;

  if (!id) {
    return { animes: [], userName: '' };
  }

  const response = await fetch(
    'https://ardent-lark-435.convex.cloud/api/run/functions/getWebsiteInfoBy_Id',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ args: { id } }),
    },
  );

  if (!response.ok) {
    redirect(302, '/');
  }

  const data = await response.json();

  if (!data.value) {
    redirect(302, '/');
  }

  return {
    animes: data.value.animes,
    userName: data.value.userName,
  };
};
