

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BJOELa3W.js","_app/immutable/chunks/BWdyMzyk.js","_app/immutable/chunks/DHyFnaxo.js"];
export const stylesheets = ["_app/immutable/assets/0.ChPXq2HN.css"];
export const fonts = [];
