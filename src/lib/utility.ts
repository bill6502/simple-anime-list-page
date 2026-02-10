export const errorMessages: Record<string, string> = {
  not_found: '找不到符合搜尋',
  not_response: '伺服器回應錯誤',
  failed_to_update_animes_list: '更新動畫清單失敗',
};

export const getErrorMessage = (error: string): string => {
  if (errorMessages[error]) return errorMessages[error];
  return '未知錯誤';
};
