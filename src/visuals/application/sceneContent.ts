/** English copy and bundled artwork for the standalone marketing excerpts. */
export const sceneLocale = {
  locale: 'en',
  t: (source: string, values: Record<string, string | number> = {}) =>
    source.replace(/\{(\w+)\}/g, (token, name: string) => String(values[name] ?? token)),
};

const assets: Record<string, string> = {
  'germany.svg': new URL('./assets/germany.svg', import.meta.url).href,
  'netherlands.svg': new URL('./assets/netherlands.svg', import.meta.url).href,
  'nginx.svg': new URL('./assets/nginx.svg', import.meta.url).href,
  'certificate.svg': new URL('./assets/certificate.svg', import.meta.url).href,
};

export const assetUrl = (_group: 'application', name: string) => assets[name];
