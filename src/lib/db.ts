import { PUBLIC_DB, PUBLIC_API_KEY } from '$env/static/public';
import { store } from './store.svelte.ts';

async function getAllAnimes() {
  return await store.fetch!(`${PUBLIC_DB}/getAllAnimes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: PUBLIC_API_KEY,
    },
    body: JSON.stringify({}),
  });
}

async function addAnimeCollection(name: string, url: string, userId: string) {
  return await store.fetch!(`${PUBLIC_DB}/addAnimeCollection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: PUBLIC_API_KEY,
      dc_token: store.access_token,
    },
    body: JSON.stringify({
      name,
      url,
      userId,
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
      api_key: PUBLIC_API_KEY,
      dc_token: store.access_token,
    },
    body: JSON.stringify({
      name,
      url,
      userId,
    }),
  });
}

async function updateWebsiteInfo(userId: string, userName: string) {
  return await store.fetch!(`${PUBLIC_DB}/updateWebsiteInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: PUBLIC_API_KEY,
      dc_token: store.access_token,
    },
    body: JSON.stringify({
      userId,
      userName,
    }),
  });
}

async function getWebsiteInfoBy_Id(id: string) {
  return await store.fetch!(`${PUBLIC_DB}/getWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: PUBLIC_API_KEY,
    },
    body: JSON.stringify({ id }),
  });
}

async function checkWebsiteInfoBy_Id(id: string) {
  return await store.fetch!(`${PUBLIC_DB}/checkWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      api_key: PUBLIC_API_KEY,
    },
    body: JSON.stringify({ id }),
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
