import db from './db.ts';
import { store } from './store.svelte.ts';

export async function discordAuth(access_token: string) {
  const response = await store.fetch!('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    showMessageAndAction('unauthorized');
    return;
  }
  const userJson = await response.json();
  if (userJson) {
    const { id, username, avatar } = userJson;

    store.user = { id, username, avatar };
    store.access_token = access_token;
  }
}

export function setLocalStorage() {
  if (store.access_token != '') {
    localStorage.setItem('access_token', store.access_token);
  }
  if (store.userAnimeListId != '') {
    localStorage.setItem('userAnimeListId', store.userAnimeListId);
  }
}

export async function updateMyAnimeList() {
  const updateWebsiteInfo = await db.updateWebsiteInfo(
    store.user!.id,
    store.user!.username,
  );

  if (!updateWebsiteInfo.ok) {
    if (updateWebsiteInfo.status == 401) {
      const { error } = await updateWebsiteInfo.json();
      if (error == 'unauthorized') {
        showMessageAndAction('unauthorized');
        return false;
      }
    }

    showMessageAndAction('動畫清單更新失敗');
    return false;
  }

  store.userAnimeListId = await updateWebsiteInfo.json();

  const getUserAnimeList = await db.getWebsiteInfoBy_Id(store.userAnimeListId);

  if (!getUserAnimeList.ok) {
    showMessageAndAction('此動畫清單不存在');
    return false;
  }

  const userAnimeListJson = await getUserAnimeList.json();
  store.userAnimeList = userAnimeListJson.animes;

  return true;
}

export function showMessageAndAction(message: string) {
  store.message = '';

  switch (message) {
    case 'unauthorized':
      store.message = 'Discord授權過期';

      localStorage.removeItem('access_token');
      localStorage.removeItem('userAnimeListId');

      store.user = null;
      store.access_token = '';
      store.userAnimeListId = '';
      break;
    default:
      store.message = message;
  }
}
