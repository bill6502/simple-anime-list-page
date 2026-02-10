import {
  PUBLIC_DISCORD_AUTH,
  PUBLIC_DISCORD_AUTH_LOCAL,
} from '$env/static/public';
import { base } from '$app/paths';
import type { Anime, path } from './type.ts';

type storeType = {
  baseUrl: string;
  authUrl: string;
  currentPath: path;
  user: any;
  userAnimeList: Omit<Anime, 'from'>[];
  userAnimeListId: string;
  lastAnimeListId: string;
  successMessage: string;
  notificationMessage: string;
  errorMessage: string;
  fetch: typeof fetch | undefined;
};

const baseUrl = base;
const authUrl = base == '' ? PUBLIC_DISCORD_AUTH_LOCAL : PUBLIC_DISCORD_AUTH;

const user = localStorage.getItem('user');
const userAnimeListId = localStorage.getItem('userAnimeListId');
const lastAnimeListId = localStorage.getItem('lastAnimeListId');

export const store = $state<storeType>({
  baseUrl,
  authUrl,
  currentPath: 'home',
  user: user ? JSON.parse(user) : null,
  userAnimeList: [],
  userAnimeListId: userAnimeListId ?? '',
  lastAnimeListId: lastAnimeListId ?? '',
  successMessage: '',
  notificationMessage: '',
  errorMessage: '',
  fetch: undefined,
});
