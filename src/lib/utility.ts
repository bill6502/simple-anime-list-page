export type error =
  | 'not_found'
  | 'not_response'
  | 'failed_to_update_animes_list';
export function getErrorMessage(error: error): string {
  switch (error) {
    case 'not_found':
      return '找不到符合搜尋';
    case 'not_response':
      return '資料庫無回應';
    case 'failed_to_update_animes_list':
      return '動畫清單更新錯誤';
    default:
      return '';
  }
}
