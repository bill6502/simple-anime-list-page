export type path = 'home' | 'mylist';
export const errorMessages: Record<string, string> = {
  not_found: '找不到符合搜尋',
  not_response: '伺服器回應錯誤',
  failed_to_update_animes_list: '更新動畫清單失敗',
} as const;

export const urls = ['ani.gamer', 'anime1.me', 'hanime1.me'];
export const urlMap = {
  'ani.gamer': '巴哈姆特動畫瘋',
  'anime1.me': 'Anime1',
  'hanime1.me': 'Hanime1',
} as const;

export type user = { id: string; username: string; avatar: string };
export type Anime = { name: string; url: string; from: string };
