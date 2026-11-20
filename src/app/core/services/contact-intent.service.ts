import { Injectable, signal } from '@angular/core';
import { InquiryType } from './contact.models';

/**
 * Lets any CTA on the page ("Solicitar dossier", "Solicitar muestras"…) preselect
 * the reason for contact in the form before scrolling to it.
 */
@Injectable({ providedIn: 'root' })
export class ContactIntentService {
  private readonly intent = signal<{ type: InquiryType } | null>(null);
  readonly current = this.intent.asReadonly();

  set(type: InquiryType): void {
    // New object each time so the same intent can be re-applied.
    this.intent.set({ type });
  }
}
