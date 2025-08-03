import { writable } from 'svelte/store';
import type { Label } from '$lib/types'

export const labels = writable<Label[]>([]);
