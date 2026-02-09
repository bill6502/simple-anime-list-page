export enum errorEnum {
  not_found,
  not_response,
  failed_to_update_animes_list,
}
export function getErrorMessage(e: errorEnum): string {
  switch (e) {
    case errorEnum.not_found:
      return '找不到符合搜尋';
    case errorEnum.not_response:
      return '資料庫無回應';
    case errorEnum.failed_to_update_animes_list:
      return '動畫清單更新錯誤';
    default:
      return '';
  }
}
