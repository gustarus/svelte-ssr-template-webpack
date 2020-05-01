import { resolveNormalizedPath } from 'svelte-ssr/index';
import { get } from 'svelte/store';
import { base } from '../stores';

export default function createUrlWithBase(uri) {
  return resolveNormalizedPath(`${get(base)}/${uri}`);
}
