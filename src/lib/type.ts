export type path = 'home' | 'mylist';
export enum messageType {
  'unauthorized',
  'not_found',
  'not_response',
}

export const urls = ['ani.gamer', 'anime1.me', 'hanime1.me'];
export const urlMap = {
  'ani.gamer': '巴哈姆特動畫瘋',
  'anime1.me': 'Anime1',
  'hanime1.me': 'Hanime1',
} as const;

export type user = { id: string; username: string; avatar: string };
export type Anime = { name: string; url: string; from: string };
