import { Injectable } from '@angular/core';
import { SITE_CONFIG } from '../../data/site.config';
import { ContactRequest, ContactResult } from './contact.models';

/**
 * Isolates how contact requests are delivered.
 *
 * There is no backend yet: `submit()` only simulates a successful delivery.
 * To connect a real endpoint (own API, Formspree, HubSpot, etc.) replace the
 * body of `submit()`, e.g.:
 *
 * ```ts
 * private readonly http = inject(HttpClient); // + provideHttpClient(withFetch()) in app.config.ts
 * async submit(request: ContactRequest): Promise<ContactResult> {
 *   try {
 *     await firstValueFrom(this.http.post('https://api.example.com/contact', request));
 *     return { ok: true };
 *   } catch {
 *     return { ok: false, reason: 'network' };
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  async submit(request: ContactRequest): Promise<ContactResult> {
    // TODO(backend): send `request` to the real endpoint.
    void request;
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true };
  }

  /** Builds a `mailto:` link with the form data, or `null` if no sales email is configured. */
  buildMailtoLink(subject: string, lines: readonly string[]): string | null {
    const to = SITE_CONFIG.contact.email;
    if (!to) return null;
    const body = lines.join('\n');
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
