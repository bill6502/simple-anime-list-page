import { redirect } from '@sveltejs/kit';
import { PUBLIC_DB } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  if (url.href.includes('#')) {
    throw redirect(307, url.href.replace('#', '?'));
  }

  const token_type = url.searchParams.get('token_type') ?? '';
  const access_token = url.searchParams.get('access_token') ?? '';

  let user = JSON.parse(localStorage.getItem('user') ?? 'null');
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

  let listId: string = '';
  if (user) {
    const updateAnimesList = await fetch(`${PUBLIC_DB}/updateWebsiteInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        args: { userId: user.id, userName: user.username },
      }),
    });

    if (!updateAnimesList.ok) {
      console.error('Failed to update animes list');
      return { error: 'failed_to_update_animes_list', user: null, listId: '' };
    }
    listId = (await updateAnimesList.json()).value as string;
  }

  const error = url.searchParams.get('error');
  if (!error) {
    return { error: '', user, listId };
  }
  return { error, user, listId };
};
