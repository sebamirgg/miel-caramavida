import { Routes } from '@angular/router';
import { languageResolver, supportedLangMatch } from './core/i18n/language.route';
import { DEFAULT_LANG } from './core/i18n/i18n.types';

/**
 * Localized routes: /es (default) and /en. The same page component is reused,
 * so switching language keeps scroll position and form state.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANG },
  {
    path: ':lang',
    canMatch: [supportedLangMatch],
    resolve: { lang: languageResolver },
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  { path: '**', redirectTo: DEFAULT_LANG },
];
