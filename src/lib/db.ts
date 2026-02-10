import { PUBLIC_DB } from '$env/static/public';
import { store } from './store.svelte.ts';

async function getAllAnimes() {
  return await store.fetch!(`${PUBLIC_DB}/getAllAnimes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      args: {},
    }),
  });
}

async function addAnimeCollection(name: string, url: string, userId: string) {
  return await store.fetch!(`${PUBLIC_DB}/addAnimeCollection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      args: { name, url, userId },
    }),
  });
}

async function deleteAnimeCollection(
  name: string,
  url: string,
  userId: string,
) {
  return await store.fetch!(`${PUBLIC_DB}/deleteAnimeCollection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      args: { name, url, userId },
    }),
  });
}

async function updateWebsiteInfo(userId: string, userName: string) {
  return await store.fetch!(`${PUBLIC_DB}/updateWebsiteInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      args: { userId, userName },
    }),
  });
}

async function getWebsiteInfoBy_Id(id: string) {
  return await store.fetch!(`${PUBLIC_DB}/getWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args: { id } }),
  });
}

async function checkWebsiteInfoBy_Id(id: string) {
  return await store.fetch!(`${PUBLIC_DB}/checkWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args: { id } }),
  });
}

export default {
  getAllAnimes,
  addAnimeCollection,
  deleteAnimeCollection,
  updateWebsiteInfo,
  getWebsiteInfoBy_Id,
  checkWebsiteInfoBy_Id,
};
