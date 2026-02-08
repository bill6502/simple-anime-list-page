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
const authUrl =
  base == ''
    ? 'https://discord.com/oauth2/authorize?client_id=1446749870101757994&response_type=token&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173&scope=identify'
    : 'https://discord.com/oauth2/authorize?client_id=1446749870101757994&response_type=token&redirect_uri=https%3A%2F%2Fbill6502.github.io%2Fsimple-anime-list-page&scope=identify';

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
