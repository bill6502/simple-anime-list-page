// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;
// export const trailingSlash = 'always';

import { browser } from '$app/environment';
import { base } from '$app/paths';
import type { PageLoad } from '../$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params }) => {
  if (!browser) {
    return { animes: [], userName: '' };
  }

  const { id } = params;
  const host = `${base}/`;

  const checkResponse = await fetch(
    'https://ardent-lark-435.convex.cloud/api/run/functions/checkWebsiteInfoBy_Id',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ args: { id } }),
    },
  );

  if (!checkResponse.ok) {
    throw redirect(302, host);
  }

  const check = await checkResponse.json();
  if (!check.value) {
    throw redirect(302, host);
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
    throw redirect(302, host);
  }

  const data = await response.json();

  return {
    animes: data.value.animes,
    userName: data.value.userName,
  };
};
