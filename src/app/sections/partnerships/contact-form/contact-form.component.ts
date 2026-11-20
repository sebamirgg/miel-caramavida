import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ContactIntentService } from '../../../core/services/contact-intent.service';
import {
  BUSINESS_TYPES,
  BusinessType,
  ContactRequest,
  HONEY_INTERESTS,
  HoneyInterest,
  INQUIRY_TYPES,
  InquiryType,
} from '../../../core/services/contact.models';
import { ContactService } from '../../../core/services/contact.service';
import { SITE_CONFIG } from '../../../data/site.config';
import { corporateEmailValidator } from './contact-form.validators';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly i18n = inject(I18nService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly t = this.i18n.t;
  protected readonly status = signal<FormStatus>('idle');
  protected readonly submitted = signal(false);

  protected readonly inquiryTypes = INQUIRY_TYPES;
  protected readonly businessTypes = BUSINESS_TYPES;
  protected readonly interests = HONEY_INTERESTS;
  protected readonly privacyUrl = SITE_CONFIG.privacyPolicyUrl;
  protected readonly showMailto =
    SITE_CONFIG.features.showMailtoFallback && !!SITE_CONFIG.contact.email;

  readonly form = this.fb.group({
    inquiryType: this.fb.control<InquiryType | ''>('', Validators.required),
    name: ['', [Validators.required, Validators.maxLength(120)]],
    company: ['', [Validators.required, Validators.maxLength(160)]],
    country: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, corporateEmailValidator]],
    businessType: this.fb.control<BusinessType | ''>('', Validators.required),
    interest: this.fb.control<HoneyInterest | ''>('', Validators.required),
    volume: ['', Validators.maxLength(120)],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    consent: [false, Validators.requiredTrue],
    /** Honeypot: hidden from people, bots tend to fill it. */
    website: [''],
  });

  /** Simple text inputs, rendered in a loop. */
  protected readonly textFields = [
    { name: 'name', type: 'text', autocomplete: 'name' },
    { name: 'company', type: 'text', autocomplete: 'organization' },
    { name: 'country', type: 'text', autocomplete: 'country-name' },
    { name: 'email', type: 'email', autocomplete: 'email' },
  ] as const;

  /** Order used to move focus to the first invalid field. */
  private readonly fieldOrder: readonly FieldName[] = [
    'inquiryType',
    'name',
    'company',
    'country',
    'email',
    'businessType',
    'interest',
    'volume',
    'message',
    'consent',
  ];

  constructor() {
    // CTAs elsewhere on the page can preselect the reason for contact.
    const intents = inject(ContactIntentService);
    effect(() => {
      const intent = intents.current();
      if (intent) this.form.controls.inquiryType.setValue(intent.type);
    });
  }

  protected showError(name: FieldName): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected errorFor(name: FieldName): string {
    const errors = this.form.controls[name].errors;
    const messages = this.t().contact.errors;
    if (!errors) return '';
    if (errors['required']) return name === 'consent' ? messages.consent : messages.required;
    if (errors['email']) return messages.email;
    if (errors['corporateEmail']) return messages.corporateEmail;
    if (errors['minlength']) return messages.minlength;
    if (errors['maxlength']) return messages.maxlength;
    return messages.required;
  }

  protected describedBy(name: FieldName, hintId?: string): string | null {
    const ids = [hintId, this.showError(name) ? `cf-${name}-error` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  protected async onSubmit(): Promise<void> {
    if (this.status() === 'sending') return;
    this.submitted.set(true);

    if (this.form.controls.website.value) {
      // Honeypot filled: pretend success, send nothing.
      this.showSuccess();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    const request = this.toRequest();
    if (!request) return;

    this.status.set('sending');
    const result = await this.contactService.submit(request);
    if (result.ok) {
      this.showSuccess();
    } else {
      this.status.set('error');
    }
  }

  protected resetForm(): void {
    this.form.reset();
    this.submitted.set(false);
    this.status.set('idle');
    this.focusAfterRender('#cf-inquiryType');
  }

  /** `mailto:` link with the current form values (fallback without backend). */
  protected mailtoHref(): string | null {
    const c = this.t().contact;
    const v = this.form.getRawValue();
    const lines = [
      `${c.fields.inquiryType}: ${v.inquiryType ? c.inquiryTypes[v.inquiryType] : ''}`,
      `${c.fields.name}: ${v.name}`,
      `${c.fields.company}: ${v.company}`,
      `${c.fields.country}: ${v.country}`,
      `${c.fields.email}: ${v.email}`,
      `${c.fields.businessType}: ${v.businessType ? c.businessTypes[v.businessType] : ''}`,
      `${c.fields.interest}: ${v.interest ? c.interests[v.interest] : ''}`,
      `${c.fields.volume}: ${v.volume}`,
      '',
      v.message,
    ];
    return this.contactService.buildMailtoLink(c.mailtoSubject, lines);
  }

  private toRequest(): ContactRequest | null {
    const v = this.form.getRawValue();
    if (!v.inquiryType || !v.businessType || !v.interest || !v.consent) return null;
    return {
      inquiryType: v.inquiryType,
      name: v.name.trim(),
      company: v.company.trim(),
      country: v.country.trim(),
      email: v.email.trim(),
      businessType: v.businessType,
      interest: v.interest,
      volume: v.volume.trim() || null,
      message: v.message.trim(),
      consent: true,
      lang: this.i18n.lang(),
    };
  }

  private showSuccess(): void {
    this.status.set('success');
    this.focusAfterRender('#cf-success-title');
  }

  private focusFirstInvalid(): void {
    const first = this.fieldOrder.find((name) => this.form.controls[name].invalid);
    if (!first) return;
    const id = first === 'interest' ? `cf-interest-${this.interests[0]}` : `cf-${first}`;
    this.host.nativeElement.querySelector<HTMLElement>(`#${id}`)?.focus();
  }

  private focusAfterRender(selector: string): void {
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus(),
      { injector: this.injector },
    );
  }
}

type FieldName = Exclude<keyof ContactFormComponent['form']['controls'], 'website'>;
