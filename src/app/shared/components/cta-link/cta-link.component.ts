import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactIntentService } from '../../../core/services/contact-intent.service';
import { InquiryType } from '../../../core/services/contact.models';
import { SECTION_IDS } from '../../../data/sections.data';

export type CtaVariant = 'primary' | 'accent' | 'outline' | 'text';

/**
 * Call-to-action link to a section of the page. When `intent` is set it also
 * preselects the reason for contact in the contact form.
 */
@Component({
  selector: 'app-cta-link',
  imports: [RouterLink],
  template: `
    <a
      class="btn btn--{{ variant() }}"
      [class.btn--small]="small()"
      [routerLink]="[]"
      [fragment]="fragment()"
      (click)="onClick()"
      >{{ label() }}</a
    >
  `,
  host: { '[class.is-block]': 'block()' },
  styles: `
    :host {
      display: inline-flex;
    }
    :host(.is-block) {
      display: flex;
    }
    :host(.is-block) a {
      flex: 1;
    }
    .btn--small {
      min-height: 2.5rem;
      padding: var(--space-2) var(--space-4);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaLinkComponent {
  private readonly intentService = inject(ContactIntentService);

  readonly label = input.required<string>();
  /** Target section. Defaults to Partnerships (the contact form is currently hidden). */
  readonly fragment = input<string>(SECTION_IDS.partnerships);
  /** Stretch to the full width of its container. */
  readonly block = input(false);
  readonly variant = input<CtaVariant>('primary');
  readonly small = input(false);
  readonly intent = input<InquiryType | null>(null);
  readonly activated = output<void>();

  protected onClick(): void {
    const intent = this.intent();
    if (intent) this.intentService.set(intent);
    this.activated.emit();
  }
}
