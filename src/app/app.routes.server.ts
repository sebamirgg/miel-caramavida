import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LANGS } from './core/i18n/i18n.types';

export const serverRoutes: ServerRoute[] = [
  {
    // Prerender one static HTML file per language: /es and /en.
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SUPPORTED_LANGS.map((lang) => ({ lang })),
  },
  {
    // Redirects ('' and unknown paths → /es) are resolved by the server.
    path: '**',
    renderMode: RenderMode.Server,
  },
];
