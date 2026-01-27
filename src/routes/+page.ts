// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;
export const trailingSlash = 'always';

import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url, fetch }) => {
  if (!browser) {
    return { collection: null };
  }

  const id = url.searchParams.get('id');

  if (!id) {
    return { animes: null };
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
    throw error(404, '找不到該收藏清單');
  }

  const data = await response.json();

  return {
    animes: data.value.animes,
    userName: data.value.userName,
  };
};
