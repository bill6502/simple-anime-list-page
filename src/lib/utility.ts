import db from './db.ts';
import { store } from './store.svelte.ts';

export function setLocalStorage() {
  if (store.user != null) {
    localStorage.setItem('user', JSON.stringify(store.user));
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
    store.errorMessage = '更新失敗';
    return;
  }

  store.userAnimeListId = await updateWebsiteInfo.json();

  const getUserAnimeList = await db.getWebsiteInfoBy_Id(store.userAnimeListId);

  if (!getUserAnimeList.ok) {
    store.notificationMessage = '此動畫清單不存在';
    return;
  }

  const userAnimeListJson = await getUserAnimeList.json();
  store.userAnimeList = userAnimeListJson.animes;
}
