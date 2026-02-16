import db from './db.ts';
import { store } from './store.svelte.ts';
import { errorMessages } from './type.ts';

export async function discordAuth(access_token: string) {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userAnimeListId');
    store.access_token = '';
    store.message = errorMessages.authorization_expired;
  } else {
    const userJson = await response.json();
    if (userJson) {
      const { id, username, avatar } = userJson;

      store.user = { id, username, avatar };
      store.access_token = access_token;
    }
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
    store.message = '更新失敗';
    return;
  }

  store.userAnimeListId = await updateWebsiteInfo.json();

  const getUserAnimeList = await db.getWebsiteInfoBy_Id(store.userAnimeListId);

  if (!getUserAnimeList.ok) {
    store.message = '此動畫清單不存在';
    return;
  }

  const userAnimeListJson = await getUserAnimeList.json();
  store.userAnimeList = userAnimeListJson.animes;
}
