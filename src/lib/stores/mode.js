import { writable } from 'svelte/store'

/** @type {import('svelte/store').Writable<any>} */
export const modeStore = writable('DEFAULT')
