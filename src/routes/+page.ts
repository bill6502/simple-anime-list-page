import type { PageLoad } from '../../.svelte-kit/types/src/routes/$types.d.ts';

export const load: PageLoad = ({ url }) => {
  const error = url.searchParams.get('error');

  if (!error) {
    return { error: '' };
  }
  return { error };
};
