import { writable } from 'svelte/store';

export const base = writable('/');
export const processing = writable(false);
