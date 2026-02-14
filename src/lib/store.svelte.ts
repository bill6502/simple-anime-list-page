import {
  PUBLIC_DISCORD_AUTH,
  PUBLIC_DISCORD_AUTH_LOCAL,
} from '$env/static/public';
import { base } from '$app/paths';
import type { Anime, path, user } from './type.ts';

type storeType = {
  baseUrl: string;
  authUrl: string;
  currentPath: path;
  lastPath: string;
  user: user | null;
  userAnimeList: Omit<Anime, 'from'>[];
  userAnimeListId: string;
  message: string;
  fetch: typeof fetch | undefined;
};

const baseUrl = base;
const authUrl = base == '' ? PUBLIC_DISCORD_AUTH_LOCAL : PUBLIC_DISCORD_AUTH;

const user = localStorage.getItem('user');
const userAnimeListId = localStorage.getItem('userAnimeListId');
const lastPath = localStorage.getItem('lastPath');

export const store = $state<storeType>({
  baseUrl,
  authUrl,
  currentPath: 'home',
  user: user ? JSON.parse(user) : null,
  userAnimeList: [],
  userAnimeListId: userAnimeListId ?? '',
  lastPath: lastPath ?? '',
  message: '',
  fetch: undefined,
});
