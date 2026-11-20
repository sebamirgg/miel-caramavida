import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Anchor links (/es#mieles) scroll to and focus their section. Scroll position
      // is kept when switching language, since the page component is reused.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'disabled' }),
      // Clicking the same anchor twice scrolls again (resolvers do not re-run: params unchanged).
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
