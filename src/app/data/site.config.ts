/**
 * Global, language-independent site configuration.
 * Values marked [PENDIENTE] must be provided by the client.
 */
export interface SiteConfig {
  /** Public base URL without trailing slash (e.g. https://www.caramavida.com). Enables canonical + hreflang. */
  siteUrl: string | null;
  /** Absolute URL of the Open Graph share image (1200x630). */
  ogImage: string | null;
  contact: {
    /** Sales inbox. Also the target of the contact form's mailto fallback. */
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  privacyPolicyUrl: string | null;
  features: {
    /** Shows the "Solicitar muestras" CTA in the partnerships section. */
    showSamplesCta: boolean;
    /** Shows the mailto fallback link under the contact form (needs `contact.email`). */
    showMailtoFallback: boolean;
    /** Rejects free email providers (gmail, hotmail…) in the contact form. */
    requireCorporateEmail: boolean;
  };
}

export const SITE_CONFIG: SiteConfig = {
  siteUrl: null, // [PENDIENTE: dominio definitivo]
  ogImage: null, // [PENDIENTE: imagen para compartir en redes, 1200x630]
  contact: {
    email: null, // [PENDIENTE: correo comercial, ej. trade@dominio.com]
    phone: null, // [PENDIENTE: teléfono comercial con código de país]
    address: null, // [PENDIENTE: dirección institucional]
  },
  privacyPolicyUrl: null, // [PENDIENTE: URL de la política de privacidad]
  features: {
    showSamplesCta: true,
    showMailtoFallback: true,
    requireCorporateEmail: true,
  },
};

/** Placeholder shown wherever a contact value is still missing. */
export const PENDING_VALUE = '[PENDIENTE]';

/** Free email providers rejected when `requireCorporateEmail` is enabled. */
export const FREE_EMAIL_DOMAINS: readonly string[] = [
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'yahoo.com',
  'icloud.com',
  'aol.com',
  'gmx.com',
  'proton.me',
  'protonmail.com',
];
