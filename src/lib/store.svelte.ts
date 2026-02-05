type storeType = {
  user: any;
  userAnimeListId: string;
  successMessage: string;
  errorMessage: string;
  message: (message: string, type: 'success' | 'error') => void;
};

const user = localStorage.getItem('user');
const userAnimeListId = localStorage.getItem('userAnimeListId');

function message(message: string, type: 'success' | 'error') {
  if (type == 'success') store.successMessage = message;
  if (type == 'error') store.errorMessage = message;

  setTimeout(() => {
    store.successMessage = '';
    store.errorMessage = '';
  }, 3000);
}

export const store = $state<storeType>({
  user: user ? JSON.parse(user) : null,
  userAnimeListId: userAnimeListId ? JSON.parse(userAnimeListId).value : '',
  successMessage: '',
  errorMessage: '',
  message,
});
