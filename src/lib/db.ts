import { PUBLIC_DB } from '$env/static/public';

async function addAnimeCollection(name: string, url: string, userId: string) {
  return await fetch(`${PUBLIC_DB}/addAnimeCollection`, {
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
  return await fetch(`${PUBLIC_DB}/updateWebsiteInfo`, {
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
  return await fetch(`${PUBLIC_DB}/getWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args: { id } }),
  });
}

async function checkWebsiteInfoBy_Id(id: string) {
  return await fetch(`${PUBLIC_DB}/checkWebsiteInfoBy_Id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ args: { id } }),
  });
}

export default {
  addAnimeCollection,
  updateWebsiteInfo,
  getWebsiteInfoBy_Id,
  checkWebsiteInfoBy_Id,
};
