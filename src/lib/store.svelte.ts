import {
  PUBLIC_DISCORD_AUTH,
  PUBLIC_DISCORD_AUTH_LOCAL,
} from '$env/static/public';
import { base } from '$app/paths';

type storeType = {
  baseUrl: string;
  authUrl: string;
  user: any;
  userAnimeListId: string;
  lastAnimeListId: string;
  successMessage: string;
  errorMessage: string;
  fetch: typeof fetch | undefined;
  message: (message: string, type: 'success' | 'error') => void;
};

const baseUrl = base;
const authUrl = base == '' ? PUBLIC_DISCORD_AUTH_LOCAL : PUBLIC_DISCORD_AUTH;

const user = localStorage.getItem('user');
const userAnimeListId = localStorage.getItem('userAnimeListId');
const lastAnimeListId = localStorage.getItem('lastAnimeListId');

let messageClearTimeout: number | null = null;
function message(message: string, type: 'success' | 'error') {
  if (type == 'success') store.successMessage = message;
  if (type == 'error') store.errorMessage = message;

  if (messageClearTimeout !== null) {
    clearTimeout(messageClearTimeout);
  }
  messageClearTimeout = setTimeout(() => {
    store.successMessage = '';
    store.errorMessage = '';
  }, 3000);
}

export const store = $state<storeType>({
  baseUrl,
  authUrl,
  user: user ? JSON.parse(user) : null,
  userAnimeListId: userAnimeListId ?? '',
  lastAnimeListId: lastAnimeListId ?? '',
  successMessage: '',
  errorMessage: '',
  fetch: undefined,
  message,
});
