import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FREE_EMAIL_DOMAINS, SITE_CONFIG } from '../../../data/site.config';

/** Rejects free email providers when `features.requireCorporateEmail` is enabled. */
export function corporateEmailValidator(control: AbstractControl<string>): ValidationErrors | null {
  if (!SITE_CONFIG.features.requireCorporateEmail) return null;
  const domain = control.value?.split('@')[1]?.trim().toLowerCase();
  return domain && FREE_EMAIL_DOMAINS.includes(domain) ? { corporateEmail: true } : null;
}
